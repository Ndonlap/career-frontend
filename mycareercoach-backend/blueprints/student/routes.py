from flask import jsonify, request, current_app
from blueprints.student import student_bp
from extensions import jwt, mongo # Import jwt and mongo instances
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, date, timedelta
from werkzeug.utils import secure_filename
import os
import random # For random questions later

# Import models
from auth.models import User
from blueprints.shared.models import AcademicRecord, Appointment, Recommendation, Course, Career, Skill
from blueprints.assessments.models import Assessment, AssessmentResult
from blueprints.public_content.models import PublicContent # For services/resources on landing

# --- Helper Functions (can be moved to a services/student_service.py later) ---

def calculate_gpa_and_rank(student_id):
    # This is a placeholder for complex GPA and rank calculation logic.
    # In a real app, this would involve querying many academic_records.
    
    # For now, let's just return some dummy data or fetch from user profile if stored.
    user = User.find_by_id(student_id)
    if user and user.role == 'student':
        # In a real scenario, aggregate from AcademicRecord
        # For demo, just return existing user GPA/rank
        gpa = user.gpa if hasattr(user, 'gpa') else 3.5
        class_rank = user.class_rank if hasattr(user, 'class_rank') else 15
        total_students = user.total_students_in_class if hasattr(user, 'total_students_in_class') else 100
        percentile = round((1 - (class_rank / total_students)) * 100, 2) if total_students > 0 else 0
        return gpa, class_rank, total_students, percentile
    return 0.0, 0, 0, 0.0

def aggregate_kpi_data(student_id):
    user = User.find_by_id(student_id)
    if not user or user.role != 'student':
        return {}

    # Academic KPIs (Placeholder calculations)
    current_gpa, class_rank, total_students, percentile = calculate_gpa_and_rank(student_id)
    
    # Fetch latest academic records for average grade/improvement
    latest_record = mongo.db.academic_records.find_one(
        {"student_id": ObjectId(student_id)},
        sort=[("term", -1), ("year", -1)] # Sort by latest term/year
    )
    average_grade = latest_record.get('average_score', 0.0) if latest_record else 0.0
    
    # Mocking previous GPA for gpaChange
    previous_gpa = user.gpa - 0.13 if user.gpa else 3.65 # Dummy calculation
    gpa_change = round(current_gpa - previous_gpa, 2)
    
    # Credits
    credits_completed = user.credits_completed if hasattr(user, 'credits_completed') else 120
    total_credits_required = user.total_credits_required if hasattr(user, 'total_credits_required') else 180

    # Behavioral KPIs (Placeholders)
    attendance_rate = 96.8 # Mock
    participation_score = 89.2 # Mock
    assignment_completion_rate = 94.5 # Mock
    late_submissions = 3 # Mock
    counseling_sessions_attended = mongo.db.appointments.count_documents({"student_id": ObjectId(student_id), "status": "completed"})
    extracurricular_participation = 4 # Mock
    peer_collaboration_score = 92.1 # Mock
    digital_engagement = 88.7 # Mock

    # Predictive KPIs (Placeholders - these would come from the recommendation engine or more advanced logic)
    graduation_probability = 97.8 # Mock
    career_readiness_score = 84.2 # Mock
    recommended_gpa = 3.85 # Mock
    risk_factors = 1 # Mock
    strength_areas = 6 # Mock
    improvement_areas = 2 # Mock
    predicted_final_gpa = 3.82 # Mock
    career_match_score = 91.5 # Mock

    return {
        "academic": {
            "currentGPA": current_gpa,
            "previousGPA": previous_gpa,
            "gpaChange": gpa_change,
            "classRank": class_rank,
            "totalStudents": total_students,
            "percentile": percentile,
            "creditsCompleted": credits_completed,
            "totalCreditsRequired": total_credits_required,
            "averageGrade": average_grade,
            "gradeImprovement": 2.3 # Mock
        },
        "behavioral": {
            "attendanceRate": attendance_rate,
            "participationScore": participation_score,
            "assignmentCompletionRate": assignment_completion_rate,
            "lateSubmissions": late_submissions,
            "counselingSessionsAttended": counseling_sessions_attended,
            "extracurricularParticipation": extracurricular_participation,
            "peerCollaborationScore": peer_collaboration_score,
            "digitalEngagement": digital_engagement
        },
        "predictive": {
            "graduationProbability": graduation_probability,
            "careerReadinessScore": career_readiness_score,
            "recommendedGPA": recommended_gpa,
            "riskFactors": risk_factors,
            "strengthAreas": strength_areas,
            "improvementAreas": improvement_areas,
            "predictedFinalGPA": predicted_final_gpa,
            "careerMatchScore": career_match_score
        }
    }

def get_performance_analytics_data(student_id, view_type="This Term"):
    # This data would typically be aggregated from academic_records
    # For now, we'll use placeholder data that mimics the frontend structure
    if view_type == "This Term":
        return {
            "labels": ["Math", "Bio", "Comp.Sci", "Econs", "Chem", "Geography", "Physics", "H.Biology"],
            "data": [
                {"subject": "Math", "performance": 85, "engagement": 90, "assessment": 88, "participation": 85, "benchmark": 80},
                {"subject": "Bio", "performance": 78, "engagement": 65, "assessment": 74, "participation": 80, "benchmark": 75},
                {"subject": "Comp.Sci", "performance": 92, "engagement": 95, "assessment": 94, "participation": 98, "benchmark": 85},
                {"subject": "Econs", "performance": 73, "engagement": 60, "assessment": 70, "participation": 65, "benchmark": 70},
                {"subject": "Chem", "performance": 81, "engagement": 75, "assessment": 83, "participation": 78, "benchmark": 78},
                {"subject": "Geography", "performance": 76, "engagement": 70, "assessment": 78, "participation": 72, "benchmark": 75},
                {"subject": "Physics", "performance": 88, "engagement": 85, "assessment": 90, "participation": 87, "benchmark": 85},
                {"subject": "H.Biology", "performance": 89, "engagement": 88, "assessment": 91, "participation": 92, "benchmark": 85}
            ]
        }
    elif view_type == "Last Term":
        return {
            "labels": ["Math", "Bio", "Comp.Sci", "Econs", "Chem", "Geography", "Physics", "H.Biology"],
            "data": [
                {"subject": "Math", "performance": 82, "engagement": 85, "assessment": 85, "participation": 80, "benchmark": 80},
                {"subject": "Bio", "performance": 74, "engagement": 60, "assessment": 72, "participation": 75, "benchmark": 75},
                {"subject": "Comp.Sci", "performance": 88, "engagement": 90, "assessment": 90, "participation": 92, "benchmark": 85},
                {"subject": "Econs", "performance": 68, "engagement": 55, "assessment": 65, "participation": 60, "benchmark": 70},
                {"subject": "Chem", "performance": 76, "engagement": 70, "assessment": 78, "participation": 72, "benchmark": 78},
                {"subject": "Geography", "performance": 73, "engagement": 68, "assessment": 75, "participation": 68, "benchmark": 75},
                {"subject": "Physics", "performance": 84, "engagement": 80, "assessment": 86, "participation": 82, "benchmark": 85},
                {"subject": "H.Biology", "performance": 86, "engagement": 82, "assessment": 88, "participation": 85, "benchmark": 85}
            ]
        }
    elif view_type == "Yearly":
        return {
            "labels": ["Term 1", "Term 2", "Term 3", "Current"],
            "data": [
                {"subject": "Term 1", "performance": 78, "engagement": 70, "assessment": 76, "participation": 72, "benchmark": 75},
                {"subject": "Term 2", "performance": 82, "engagement": 75, "assessment": 80, "participation": 78, "benchmark": 78},
                {"subject": "Term 3", "performance": 85, "engagement": 82, "assessment": 83, "participation": 84, "benchmark": 80},
                {"subject": "Current", "performance": 87, "engagement": 85, "assessment": 86, "participation": 87, "benchmark": 82}
            ]
        }
    return {"labels": [], "data": []}

def get_performance_trend_data(student_id):
    # This data would come from historical academic_records or combined with engagement data
    # For now, placeholder data
    return [
        {"month": "Sep", "academic": 82, "engagement": 78},
        {"month": "Oct", "academic": 85, "engagement": 80},
        {"month": "Nov", "academic": 87, "engagement": 83},
        {"month": "Dec", "academic": 89, "engagement": 86},
        {"month": "Jan", "academic": 91, "engagement": 88},
        {"month": "Feb", "academic": 93, "engagement": 90}
    ]

def get_subject_distribution_data(student_id):
    # This would come from analyzing the categories of courses a student has taken
    # or their declared interests.
    # For now, placeholder data
    return [
        {"name": "STEM", "value": 35, "color": "#3B82F6"},
        {"name": "Humanities", "value": 20, "color": "#EF4444"},
        {"name": "Social Sciences", "value": 25, "color": "#10B981"},
        {"name": "Languages", "value": 15, "color": "#F59E0B"},
        {"name": "Arts", "value": 5, "color": "#8B5CF6"}
    ]

def get_recent_achievements(student_id):
    # This would come from a dedicated achievements collection or embedded in the user model
    # For now, placeholder data
    return [
        {"title": "Dean's List", "date": "This Term", "type": "academic"},
        {"title": "Research Paper Published", "date": "2 weeks ago", "type": "research"},
        {"title": "Leadership Certificate", "date": "1 month ago", "type": "leadership"},
        {"title": "Top 5% Performance", "date": "Last Term", "type": "academic"}
    ]

def get_upcoming_events(student_id):
    # This would come from querying the appointments collection for upcoming sessions,
    # and potentially a separate events/deadlines collection.
    
    # Fetch upcoming appointments for the student
    upcoming_appointments_db = mongo.db.appointments.find({
        "student_id": ObjectId(student_id),
        "date": {"$gte": datetime.now().date()}, # Appointments from today onwards
        "status": {"$in": ["pending", "confirmed"]}
    }).sort([("date", 1), ("time", 1)]) # Sort by soonest

    events = []
    for app in upcoming_appointments_db:
        app_date = app['date'].strftime('%b %d')
        events.append({
            "title": f"{app['type']} with Counselor",
            "date": app_date,
            "priority": app['priority'],
            "type": "appointment"
        })
    
    # Add mock fixed events
    events.extend([
        {"title": "Final Project Submission", "date": "Dec 15", "priority": "high", "type": "deadline"},
        {"title": "Career Fair", "date": "Dec 18", "priority": "medium", "type": "event"},
        {"title": "Internship Application", "date": "Dec 22", "priority": "high", "type": "application"},
        {"title": "Thesis Proposal Review", "date": "Jan 05", "priority": "medium", "type": "academic"}
    ])
    
    # Sort all events by date (if date is comparable)
    events.sort(key=lambda x: datetime.strptime(x['date'] + ' 2025', '%b %d %Y')) # Assuming current year for mock dates
    return events


# --- Routes ---

@student_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_student_profile():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"msg": "Student not found"}), 404

    return jsonify(user.to_dict()), 200

@student_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_student_profile():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    data = request.get_json()
    update_data = {k: v for k, v in data.items() if k in ['first_name', 'last_name', 'school', 'grade']}

    if not update_data:
        return jsonify({"msg": "No data provided for update"}), 400

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Student not found"}), 404
        
        updated_user = User.find_by_id(user_id)
        return jsonify(updated_user.to_dict()), 200
    except Exception as e:
        return jsonify({"msg": f"Error updating profile: {str(e)}"}), 500

@student_bp.route('/interests', methods=['POST'])
@jwt_required()
def submit_student_interests():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    data = request.get_json()
    # Ensure all interest fields are present or default to 0
    interests = {
        "problem_solving": data.get('problemSolving', 0),
        "creativity": data.get('creativity', 0),
        "chemistry": data.get('people', 0), # Mapping 'people' to 'chemistry' as per frontend file
        "economics_management": data.get('leadership', 0), # Mapping 'leadership' to 'economics_management'
        "computer_science_innovation": data.get('research', 0), # Mapping 'research' to 'computer_science_innovation'
    }

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"interests": interests, "updated_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Student not found"}), 404
        
        return jsonify({"msg": "Interests updated successfully", "interests": interests}), 200
    except Exception as e:
        return jsonify({"msg": f"Error updating interests: {str(e)}"}), 500

@student_bp.route('/academic_records', methods=['GET'])
@jwt_required()
def get_student_academic_records():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    records = AcademicRecord.find_by_student_id(user_id)
    return jsonify([record.to_dict() for record in records]), 200


@student_bp.route('/upload_report_card', methods=['POST'])
@jwt_required()
def upload_report_card():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        # Create a student-specific folder if it doesn't exist
        student_upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], student_id)
        if not os.path.exists(student_upload_folder):
            os.makedirs(student_upload_folder)
        
        file_path = os.path.join(student_upload_folder, filename)
        file.save(file_path)

        # Store a basic academic record (for now, without OCR parsing)
        new_record = AcademicRecord(
            student_id=student_id,
            term=datetime.utcnow().strftime("%Y-%m"), # Example term, might be passed from frontend
            year=datetime.utcnow().year,
            average_score=0, # Placeholder, would be updated after parsing
            subjects=[], # Placeholder, would be updated after parsing
            uploaded_report_card={
                "filename": filename,
                "file_path": file_path, # In a real app, store relative path or cloud URL
                "upload_date": datetime.utcnow(),
                "processed_status": "pending"
            }
        )
        record_id = new_record.save()

        return jsonify({"msg": "Report card uploaded successfully", "record_id": str(record_id)}), 201
    
    return jsonify({"msg": "File upload failed"}), 500


@student_bp.route('/book_counseling_session', methods=['POST'])
@jwt_required()
def book_counseling_session():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    data = request.get_json()
    counselor_id = data.get('counselor_id') # Frontend should select a counselor
    booking_date_str = data.get('date')
    booking_time = data.get('time')
    notes = data.get('notes')
    
    if not counselor_id or not booking_date_str or not booking_time:
        return jsonify({"msg": "Missing counselor_id, date, or time"}), 400

    try:
        booking_date = datetime.strptime(booking_date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"msg": "Invalid date format. Use YYYY-MM-DD"}), 400
    
    # Optional: Verify counselor_id exists and is a counselor
    counselor = User.find_by_id(counselor_id)
    if not counselor or counselor.role != 'counselor':
        return jsonify({"msg": "Invalid counselor ID"}), 400

    # Optional: Check counselor availability (more complex logic here)
    # For now, just assume available.

    try:
        new_appointment = Appointment(
            student_id=student_id,
            counselor_id=counselor_id,
            date=booking_date,
            time=booking_time,
            duration_minutes=45, # Default duration
            type="General Counseling", # Default type
            notes_by_student=notes,
            status="pending",
            priority="medium"
        )
        appointment_id = new_appointment.save()
        return jsonify({"msg": "Counseling session booked successfully", "appointment_id": str(appointment_id)}), 201
    except Exception as e:
        return jsonify({"msg": f"Error booking session: {str(e)}"}), 500

@student_bp.route('/my_bookings', methods=['GET'])
@jwt_required()
def get_student_bookings():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    # Fetch all appointments for the student, sorted by date and time
    appointments_cursor = mongo.db.appointments.find({"student_id": ObjectId(student_id)}).sort([("date", 1), ("time", 1)])
    
    # Convert to list of dictionaries for JSON response
    bookings_list = []
    for app in appointments_cursor:
        app['id'] = str(app['_id'])
        app['_id'] = str(app['_id']) # Convert ObjectId
        app['student_id'] = str(app['student_id'])
        app['counselor_id'] = str(app['counselor_id'])
        app['date'] = app['date'].isoformat() # Convert date object to ISO string
        bookings_list.append(app)
        
    return jsonify(bookings_list), 200

@student_bp.route('/recommendations/summary', methods=['GET'])
@jwt_required()
def get_student_recommendations_summary():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    # Fetch recent recommendations for the student
    recommendations_cursor = mongo.db.recommendations.find(
        {"student_id": ObjectId(student_id), "status": {"$in": ["Generated", "Approved", "Delivered"]}}
    ).sort("created_at", -1).limit(5) # Get top 5 recent recommendations

    recs_list = []
    for rec_data in recommendations_cursor:
        rec = Recommendation(student_id=str(rec_data['student_id']), **rec_data)
        recs_list.append(rec.to_dict())
        
    return jsonify(recs_list), 200

@student_bp.route('/recommendations/detailed/<rec_id>', methods=['GET'])
@jwt_required()
def get_student_detailed_recommendation(rec_id):
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    recommendation_data = mongo.db.recommendations.find_one(
        {"_id": ObjectId(rec_id), "student_id": ObjectId(student_id)}
    )
    if not recommendation_data:
        return jsonify({"msg": "Recommendation not found or not for this student"}), 404
    
    rec = Recommendation(student_id=str(recommendation_data['student_id']), **recommendation_data)
    
    # Enrich with course/career/skill details if they are stored as IDs
    # For now, we assume recommended_courses and suggested_skills might be embedded directly
    
    return jsonify(rec.to_dict()), 200


@student_bp.route('/dashboard_summary', methods=['GET'])
@jwt_required()
def get_student_dashboard_summary():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    user = User.find_by_id(student_id)
    if not user:
        return jsonify({"msg": "Student not found"}), 404

    # Fetch and aggregate all data required by StudentDashboard.tsx
    kpi_data = aggregate_kpi_data(student_id)
    
    # Default to "This Term" for the main chart on dashboard load
    performance_analytics = get_performance_analytics_data(student_id, view_type="This Term") 
    
    performance_trend = get_performance_trend_data(student_id)
    
    career_recommendations_db = mongo.db.recommendations.find(
        {"student_id": ObjectId(student_id), "type": "Career Path", "status": {"$in": ["Generated", "Approved", "Delivered"]}}
    ).sort("match_score", -1).limit(3) # Top 3 career recommendations
    career_recommendations = []
    for rec_data in career_recommendations_db:
        # Assuming recommendation has title, match, growth, salary, demand fields
        # In a real app, you might fetch career details from 'careers' collection using rec.career_id
        career_recommendations.append({
            "title": rec_data.get('recommended_careers', [{}])[0].get('name', 'N/A') if rec_data.get('recommended_careers') else "Data Science", # Mock for now
            "match": rec_data.get('match_score', 90),
            "growth": "+23%", # Mock
            "salary": "$125k", # Mock
            "demand": "High", # Mock
            "color": random.choice(["#3B82F6", "#10B981", "#F59E0B"]) # Mock
        })
    
    subject_distribution = get_subject_distribution_data(student_id)
    recent_achievements = get_recent_achievements(student_id)
    upcoming_events = get_upcoming_events(student_id)

    response_data = {
        "user_profile": user.to_dict(),
        "kpi_data": kpi_data,
        "performance_analytics": performance_analytics,
        "performance_trend_data": performance_trend,
        "career_recommendations": career_recommendations,
        "subject_distribution_data": subject_distribution,
        "recent_achievements": recent_achievements,
        "upcoming_events": upcoming_events,
    }

    return jsonify(response_data), 200

@student_bp.route('/performance_analytics', methods=['GET'])
@jwt_required()
def get_performance_analytics():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    view_type = request.args.get('view', 'This Term') # "This Term", "Last Term", "Yearly"
    data = get_performance_analytics_data(student_id, view_type)
    return jsonify(data), 200

@student_bp.route('/landing_page_stats', methods=['GET'])
@jwt_required()
def get_student_landing_page_stats():
    current_user_identity = get_jwt_identity()
    student_id = current_user_identity['id']
    user_role = current_user_identity['role']

    if user_role != 'student':
        return jsonify({"msg": "Access denied: Not a student"}), 403

    # Stat Cards
    uploaded_reports_count = mongo.db.academic_records.count_documents({"student_id": ObjectId(student_id), "uploaded_report_card": {"$ne": None}})
    recommendations_generated_count = mongo.db.recommendations.count_documents({"student_id": ObjectId(student_id), "status": {"$in": ["Generated", "Approved", "Delivered"]}})
    counseling_sessions_count = mongo.db.appointments.count_documents({"student_id": ObjectId(student_id), "status": {"$in": ["pending", "confirmed", "completed"]}})
    courses_explored_count = mongo.db.users.count_documents({"_id": ObjectId(student_id), "interests": {"$ne": {}}}) # Simplified: if interests are set

    stat_cards = {
        "uploaded_report_cards": uploaded_reports_count,
        "recommendations_generated": recommendations_generated_count,
        "counseling_sessions": counseling_sessions_count,
        "courses_explored": courses_explored_count
    }

    # Student Impact Snapshot (Bar Chart) - Mocking data for now
    impact_snapshot_data = {
        "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        "datasets": [
            {"label": "Completed", "data": [12, 20, 22, 28, 25, 18, 16, 20, 30, 35, 27, 32]}, # Example: completed activities/sessions
            {"label": "Ongoing", "data": [8, 12, 11, 10, 15, 9, 7, 10, 12, 13, 10, 11]},
            {"label": "Rescheduled", "data": [5, 7, 6, 9, 12, 5, 4, 8, 10, 9, 7, 8]},
        ]
    }
    
    # Resource Distribution (Doughnut Chart) - Mocking data for now
    # This might represent engagement with different types of recommendations/resources
    resource_distribution_data = {
        "labels": ["Correct Choice", "Misaligned Choice", "Undecided Students", "More Guidance"],
        "datasets": [
            {"data": [24, 18, 32, 22], "backgroundColor": ["#ff6384", "#36a2eb", "#9966ff", "#ffce56"]}
        ]
    }

    return jsonify({
        "stat_cards": stat_cards,
        "impact_snapshot_data": impact_snapshot_data,
        "resource_distribution_data": resource_distribution_data
    }), 200

# You can add more routes here for specific elements like:
# - get_aptitude_test_status
# - submit_aptitude_test
# - get_detailed_report_data (for ViewReport.tsx)
# - etc.