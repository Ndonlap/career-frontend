from flask import jsonify, request, current_app
from blueprints.assessments import assessments_bp
from extensions import jwt, mongo # Import jwt and mongo instances
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime
import random

# Import models
from auth.models import User
from blueprints.assessments.models import Assessment, AssessmentQuestion, AssessmentResult
from blueprints.shared.models import Career # Needed for insights

# --- Helper Function for Authorization ---
def check_admin_role():
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({"msg": "Access denied: Admins only"}), 403
    return None # No error

def check_student_role():
    identity = get_jwt_identity()
    if identity.get('role') != 'student':
        return jsonify({"msg": "Access denied: Students only"}), 403
    return None # No error


# --- Admin Routes for Assessment Management ---

@assessments_bp.route('/admin/assessments', methods=['POST'])
@jwt_required()
def create_assessment():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    name = data.get('name')
    description = data.get('description')
    assessment_type = data.get('type') # e.g., "aptitude", "interest", "personality"
    duration_minutes = data.get('duration_minutes', 0)
    questions_data = data.get('questions', [])
    status = data.get('status', 'draft') # Default to draft

    if not all([name, description, assessment_type, questions_data]):
        return jsonify({"msg": "Missing required fields: name, description, type, questions"}), 400

    # Validate questions structure
    for q_data in questions_data:
        if not all([q_data.get('text'), q_data.get('options') and isinstance(q_data['options'], list)]):
            return jsonify({"msg": "Each question must have 'text' and 'options'"}), 400
        if assessment_type in ["aptitude", "quiz"] and not q_data.get('correct_answer'):
            return jsonify({"msg": f"Assessment type '{assessment_type}' requires 'correct_answer' for each question"}), 400
        
        # Convert options to list if not already
        if isinstance(q_data['options'], str):
            q_data['options'] = [opt.strip() for opt in q_data['options'].split(',')]

    current_user_identity = get_jwt_identity()
    created_by_id = current_user_identity['id']

    try:
        new_assessment = Assessment(
            name=name,
            description=description,
            type=assessment_type,
            duration_minutes=duration_minutes,
            number_of_questions=len(questions_data),
            created_by=created_by_id,
            questions=questions_data, # These will be stored as dicts
            status=status
        )
        assessment_id = new_assessment.save()
        return jsonify({"msg": "Assessment created successfully", "assessment_id": str(assessment_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating assessment: {e}")
        return jsonify({"msg": f"Error creating assessment: {str(e)}"}), 500

@assessments_bp.route('/admin/assessments', methods=['GET'])
@jwt_required()
def get_all_assessments_admin():
    error = check_admin_role()
    if error: return error

    assessments_cursor = mongo.db.assessments.find({})
    assessments_list = []
    for ass in assessments_cursor:
        # Include solutions for admin view
        assessment_obj = Assessment(created_by=str(ass['created_by']), **ass) # Reconstruct for to_dict method
        assessments_list.append(assessment_obj.to_dict(include_solutions=True))
    
    return jsonify(assessments_list), 200

@assessments_bp.route('/admin/assessments/<assessment_id>', methods=['GET'])
@jwt_required()
def get_assessment_details_admin(assessment_id):
    error = check_admin_role()
    if error: return error

    assessment_data = mongo.db.assessments.find_one({"_id": ObjectId(assessment_id)})
    if not assessment_data:
        return jsonify({"msg": "Assessment not found"}), 404
    
    assessment_obj = Assessment(created_by=str(assessment_data['created_by']), **assessment_data)
    return jsonify(assessment_obj.to_dict(include_solutions=True)), 200

@assessments_bp.route('/admin/assessments/<assessment_id>', methods=['PUT'])
@jwt_required()
def update_assessment(assessment_id):
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    update_fields = {}

    if 'name' in data: update_fields['name'] = data['name']
    if 'description' in data: update_fields['description'] = data['description']
    if 'type' in data: update_fields['type'] = data['type']
    if 'duration_minutes' in data: update_fields['duration_minutes'] = data['duration_minutes']
    if 'status' in data: update_fields['status'] = data['status']
    
    # Handle questions update (can be complex: full replacement or partial update)
    if 'questions' in data:
        # This assumes a full replacement of the questions array
        questions_data = data.get('questions', [])
        for q_data in questions_data:
            if not all([q_data.get('text'), q_data.get('options') and isinstance(q_data['options'], list)]):
                return jsonify({"msg": "Each question must have 'text' and 'options'"}), 400
            if q_data.get('options') and isinstance(q_data['options'], str):
                q_data['options'] = [opt.strip() for opt in q_data['options'].split(',')]

        update_fields['questions'] = questions_data
        update_fields['number_of_questions'] = len(questions_data)

    if not update_fields:
        return jsonify({"msg": "No fields provided for update"}), 400

    update_fields['updated_at'] = datetime.utcnow()

    try:
        result = mongo.db.assessments.update_one(
            {"_id": ObjectId(assessment_id)},
            {"$set": update_fields}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Assessment not found"}), 404
        return jsonify({"msg": "Assessment updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating assessment: {e}")
        return jsonify({"msg": f"Error updating assessment: {str(e)}"}), 500

@assessments_bp.route('/admin/assessments/<assessment_id>', methods=['DELETE'])
@jwt_required()
def delete_assessment(assessment_id):
    error = check_admin_role()
    if error: return error

    try:
        result = mongo.db.assessments.delete_one({"_id": ObjectId(assessment_id)})
        if result.deleted_count == 0:
            return jsonify({"msg": "Assessment not found"}), 404
        
        # Optional: Delete all associated AssessmentResults
        mongo.db.assessment_results.delete_many({"assessment_id": ObjectId(assessment_id)})

        return jsonify({"msg": "Assessment deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting assessment: {e}")
        return jsonify({"msg": f"Error deleting assessment: {str(e)}"}), 500


# --- Student Routes for Taking and Viewing Assessments ---

@assessments_bp.route('/available', methods=['GET'])
@jwt_required()
def get_available_assessments_student():
    error = check_student_role()
    if error: return error

    # Only show published assessments to students
    assessments_cursor = mongo.db.assessments.find({"status": "published"})
    
    available_assessments = []
    for ass_data in assessments_cursor:
        # Do not include questions or solutions here, just metadata
        ass_data['id'] = str(ass_data['_id'])
        ass_data.pop('_id')
        ass_data.pop('questions', None) # Ensure questions are not sent
        ass_data.pop('created_by', None)
        ass_data.pop('created_at', None)
        ass_data.pop('updated_at', None)
        available_assessments.append(ass_data)
        
    return jsonify(available_assessments), 200

@assessments_bp.route('/<assessment_id>/start', methods=['GET'])
@jwt_required()
def start_assessment(assessment_id):
    error = check_student_role()
    if error: return error

    num_questions = request.args.get('num_questions', type=int, default=10)

    assessment_data = mongo.db.assessments.find_one(
        {"_id": ObjectId(assessment_id), "status": "published"}
    )
    
    if not assessment_data:
        return jsonify({"msg": "Assessment not found or not published"}), 404

    assessment_obj = Assessment(created_by=str(assessment_data['created_by']), **assessment_data)
    
    # Get random questions, ensuring correct answers are not exposed
    questions_for_student = assessment_obj.get_random_questions(assessment_id, num_questions)

    return jsonify({
        "assessment_id": str(assessment_obj._id),
        "name": assessment_obj.name,
        "description": assessment_obj.description,
        "type": assessment_obj.type,
        "duration_minutes": assessment_obj.duration_minutes,
        "questions": questions_for_student
    }), 200

@assessments_bp.route('/<assessment_id>/submit', methods=['POST'])
@jwt_required()
def submit_assessment(assessment_id):
    error = check_student_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']

    data = request.get_json()
    student_answers = data.get('answers', []) # List of {"question_id": "...", "student_answer": "..."}

    if not student_answers:
        return jsonify({"msg": "No answers submitted"}), 400

    assessment_data = mongo.db.assessments.find_one(
        {"_id": ObjectId(assessment_id), "status": "published"}
    )
    if not assessment_data:
        return jsonify({"msg": "Assessment not found or not published"}), 404
    
    assessment_obj = Assessment(created_by=str(assessment_data['created_by']), **assessment_data)
    
    score = 0
    total_points_possible = 0
    processed_answers = []
    
    # Map original questions by ID for easy lookup
    original_questions_map = {str(q['_id']): q for q in assessment_obj.questions}

    for submitted_answer in student_answers:
        q_id = submitted_answer.get('question_id')
        s_answer = submitted_answer.get('student_answer')

        if q_id not in original_questions_map:
            current_app.logger.warning(f"Submitted answer for unknown question ID: {q_id}")
            continue # Skip unknown questions

        original_q = original_questions_map[q_id]
        
        is_correct = False
        points_earned = 0
        
        # Only score if the assessment type is meant to be scored
        if assessment_obj.type in ["aptitude", "quiz"]:
            correct_ans = original_q.get('correct_answer')
            q_points = original_q.get('points', 1)
            total_points_possible += q_points

            if correct_ans is not None:
                # Handle single answer or list of answers for matching
                if isinstance(correct_ans, list) and isinstance(s_answer, list):
                    if set(correct_ans) == set(s_answer):
                        is_correct = True
                elif str(correct_ans) == str(s_answer): # Convert to string for comparison safety
                    is_correct = True
            
            if is_correct:
                score += q_points
                points_earned = q_points

        processed_answers.append({
            "question_id": q_id,
            "student_answer": s_answer,
            "is_correct": is_correct, # False for non-scored tests, or if incorrect
            "points_earned": points_earned
        })
    
    # --- Generate Insights (Placeholder Logic) ---
    # This is where your recommendation engine's assessment processing would shine.
    # For now, it's basic and illustrative.
    insights = {
        "strengths": [],
        "weaknesses": [],
        "career_suggestions": [],
        "skill_development_areas": []
    }

    if assessment_obj.type == "aptitude":
        # Example: if a student scored high in 'Logical Reasoning' questions
        # this would be determined by analyzing the 'category' of correctly answered questions
        if score > (total_points_possible * 0.7):
            insights["strengths"].append("General Aptitude")
            insights["career_suggestions"].append({"title": "Data Scientist", "match": "High"})
        else:
            insights["weaknesses"].append("General Aptitude")
            insights["skill_development_areas"].append("Problem Solving")
    elif assessment_obj.type == "interest":
        # For interest assessments, parse the actual choices made by the student
        # e.g., if many answers point to 'creative' activities
        # This requires more complex parsing of specific answers
        insights["career_suggestions"].append({"title": "UX/UI Designer", "match": "Medium"}) # Mock
        insights["skill_development_areas"].append("Communication Skills") # Mock


    try:
        new_result = AssessmentResult(
            student_id=student_id,
            assessment_id=assessment_id,
            submission_date=datetime.utcnow(),
            score=score,
            total_points_possible=total_points_possible,
            answers=processed_answers,
            insights=insights
        )
        result_id = new_result.save()
        
        return jsonify({
            "msg": "Assessment submitted successfully",
            "result_id": str(result_id),
            "score": score,
            "total_points_possible": total_points_possible,
            "insights": insights
        }), 201
    except Exception as e:
        current_app.logger.error(f"Error submitting assessment: {e}")
        return jsonify({"msg": f"Error submitting assessment: {str(e)}"}), 500


@assessments_bp.route('/student/results', methods=['GET'])
@jwt_required()
def get_student_assessment_results():
    error = check_student_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']

    results_cursor = mongo.db.assessment_results.find({"student_id": ObjectId(student_id)}).sort("submission_date", -1)
    
    results_list = []
    for res_data in results_cursor:
        # Fetch assessment name for display
        assessment = mongo.db.assessments.find_one({"_id": ObjectId(res_data['assessment_id'])})
        res_data['assessment_name'] = assessment['name'] if assessment else 'Unknown Assessment'
        
        res_obj = AssessmentResult(student_id=str(res_data['student_id']), assessment_id=str(res_data['assessment_id']), submission_date=res_data['submission_date'], answers=res_data['answers'], **res_data)
        results_list.append(res_obj.to_dict())
        
    return jsonify(results_list), 200

@assessments_bp.route('/student/results/<result_id>', methods=['GET'])
@jwt_required()
def get_single_student_assessment_result(result_id):
    error = check_student_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']

    result_data = mongo.db.assessment_results.find_one(
        {"_id": ObjectId(result_id), "student_id": ObjectId(student_id)}
    )
    if not result_data:
        return jsonify({"msg": "Assessment result not found or not for this student"}), 404
    
    assessment_data = mongo.db.assessments.find_one({"_id": ObjectId(result_data['assessment_id'])})
    if assessment_data:
        result_data['assessment_name'] = assessment_data['name']
        result_data['assessment_description'] = assessment_data['description']
        # Also, fetch original questions with explanations/correct answers for detailed feedback
        # This requires careful merging of student's answers with original questions
        detailed_questions = []
        original_questions_map = {str(q['_id']): q for q in assessment_data.get('questions', [])}
        for ans in result_data['answers']:
            q_id = ans['question_id']
            if q_id in original_questions_map:
                q_detail = original_questions_map[q_id].copy()
                q_detail['id'] = str(q_detail['_id'])
                q_detail.pop('_id')
                q_detail['student_answer'] = ans.get('student_answer')
                q_detail['is_correct'] = ans.get('is_correct')
                q_detail['points_earned'] = ans.get('points_earned')
                detailed_questions.append(q_detail)
        result_data['detailed_questions'] = detailed_questions


    result_obj = AssessmentResult(student_id=str(result_data['student_id']), assessment_id=str(result_data['assessment_id']), submission_date=result_data['submission_date'], answers=result_data['answers'], **result_data)
    
    return jsonify(result_obj.to_dict()), 200