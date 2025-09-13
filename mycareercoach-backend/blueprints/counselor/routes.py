from flask import jsonify, request, current_app
from blueprints.counselor import counselor_bp
from extensions import jwt, mongo # Import jwt and mongo instances
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, date, timedelta
import random

# Import models
from auth.models import User
from blueprints.shared.models import AcademicRecord, Appointment, Recommendation, Course, Career, Skill
from blueprints.assessments.models import AssessmentResult # For student results


# --- Helper Functions for Authorization ---
def check_counselor_role():
    identity = get_jwt_identity()
    if identity.get('role') != 'counselor':
        return jsonify({"msg": "Access denied: Counselors only"}), 403
    return None # No error


# --- Helper Functions for Data Aggregation (can be moved to services/counselor_service.py) ---

def get_counselor_kpis(counselor_id, timeframe="month"):
    # This function would aggregate data based on the counselor's assigned students and appointments

    # Define date range based on timeframe
    end_date = datetime.utcnow()
    if timeframe == "week":
        start_date = end_date - timedelta(weeks=1)
    elif timeframe == "month":
        start_date = end_date - timedelta(days=30)
    else: # quarter
        start_date = end_date - timedelta(days=90)

    # 1. Active Students
    # For now, let's assume a counselor 'manages' students by having their ID in assigned_counselor_id
    active_students_count = mongo.db.users.count_documents(
        {"role": "student", "assigned_counselor_id": ObjectId(counselor_id), "status": "active"}
    )
    # Mock monthly growth for demo
    monthly_growth = 12.5 # Placeholder, would involve historical data comparison

    # 2. Total Sessions & Completion Rate
    completed_sessions = mongo.db.appointments.count_documents(
        {"counselor_id": ObjectId(counselor_id), "status": "completed", "created_at": {"$gte": start_date}}
    )
    all_sessions_in_period = mongo.db.appointments.count_documents(
        {"counselor_id": ObjectId(counselor_id), "status": {"$in": ["completed", "confirmed"]}, "created_at": {"$gte": start_date}}
    )
    completion_rate = round((completed_sessions / all_sessions_in_period) * 100, 2) if all_sessions_in_period > 0 else 0.0

    # 3. Satisfaction Score (Requires student feedback on appointments)
    # Assuming `session_feedback` is stored in Appointment model
    # For now, mock it or get an average from available feedback
    # Example aggregation for real data:
    # pipeline = [
    #     {"$match": {"counselor_id": ObjectId(counselor_id), "session_feedback.rating": {"$exists": True}}},
    #     {"$group": {"_id": None, "avg_rating": {"$avg": "$session_feedback.rating"}}}
    # ]
    # avg_rating_result = list(mongo.db.appointments.aggregate(pipeline))
    # satisfaction_score = round(avg_rating_result[0]['avg_rating'], 1) if avg_rating_result else 0.0
    satisfaction_score = 4.7 # Mock

    # 4. Pending Appointments
    pending_appointments_count = mongo.db.appointments.count_documents(
        {"counselor_id": ObjectId(counselor_id), "status": "pending", "date": {"$gte": datetime.now().date()}}
    )
    
    # 5. Recommendations Made (by this counselor or for their students)
    recommendations_made = mongo.db.recommendations.count_documents(
        {"$or": [
            {"counselor_id": ObjectId(counselor_id)}, # Counselor created/reviewed
            {"student_id": {"$in": [s['_id'] for s in mongo.db.users.find({"assigned_counselor_id": ObjectId(counselor_id)}, {"_id": 1})]} } # For their assigned students
        ], "created_at": {"$gte": start_date}}
    )

    return {
        "activeStudents": active_students_count,
        "totalSessions": completed_sessions, # Or all_sessions_in_period for "total handled"
        "completionRate": completion_rate,
        "satisfactionScore": satisfaction_score,
        "pendingAppointments": pending_appointments_count,
        "recommendationsMade": recommendations_made,
        "monthlyGrowth": monthly_growth,
        "averageSessionDuration": 45, # Mock
        "careerPathsExplored": 67, # Mock
        "riskStudents": mongo.db.users.count_documents({"role": "student", "assigned_counselor_id": ObjectId(counselor_id), "risk_level": "High"}),
        "successStories": 34, # Mock
        "resourcesShared": 189 # Mock
    }

def get_student_engagement_analytics(counselor_id):
    # This should aggregate data over time for sessions, satisfaction, completion for the counselor's students
    # For now, placeholder data
    return [
        {"month": "Jan", "sessions": 45, "satisfaction": 4.5, "completion": 87},
        {"month": "Feb", "sessions": 52, "satisfaction": 4.6, "completion": 89},
        {"month": "Mar", "sessions": 48, "satisfaction": 4.4, "completion": 85},
        {"month": "Apr", "sessions": 61, "satisfaction": 4.7, "completion": 92},
        {"month": "May", "sessions": 58, "satisfaction": 4.8, "completion": 94},
        {"month": "Jun", "sessions": 67, "satisfaction": 4.9, "completion": 96}
    ]

def get_session_effectiveness_data(counselor_id):
    # This would aggregate data from appointment feedback, matching to categories
    # For now, placeholder data
    return [
        {"category": "Career Clarity", "achieved": 78, "target": 85},
        {"category": "Academic Planning", "achieved": 92, "target": 90},
        {"category": "Skill Development", "achieved": 85, "target": 88},
        {"category": "Goal Setting", "achieved": 89, "target": 85},
        {"category": "Decision Making", "achieved": 76, "target": 80}
    ]

def get_career_interest_distribution(counselor_id):
    # Aggregate interests from all assigned students
    # Example: group student interests by category and count
    # pipeline = [
    #     {"$match": {"role": "student", "assigned_counselor_id": ObjectId(counselor_id), "interests": {"$ne": {}}}},
    #     {"$project": {"interest_keys": {"$objectToArray": "$interests"}}},
    #     {"$unwind": "$interest_keys"},
    #     {"$group": {"_id": "$interest_keys.k", "count": {"$sum": 1}}} # Count how many students have a non-zero interest in each key
    # ]
    # interests_data = list(mongo.db.users.aggregate(pipeline))
    # Format this data into the required frontend format

    # For now, placeholder data
    return [
        {"name": "STEM", "value": 35, "color": "#3B82F6"},
        {"name": "Healthcare", "value": 22, "color": "#10B981"},
        {"name": "Business", "value": 18, "color": "#F59E0B"},
        {"name": "Arts & Design", "value": 12, "color": "#8B5CF6"},
        {"name": "Education", "value": 8, "color": "#EF4444"},
        {"name": "Other", "value": 5, "color": "#6B7280"}
    ]

def get_achievement_metrics(counselor_id):
    # Aggregated from students' achievements or status updates
    # For now, placeholder data
    return [
        {"title": "Students Graduated", "count": 45, "change": "+8 this month", "color": "blue"},
        {"title": "Career Matches Made", "count": 127, "change": "+15 this week", "color": "green"},
        {"title": "College Admissions", "count": 89, "change": "+12 this month", "color": "purple"},
        {"title": "Scholarships Secured", "count": 34, "change": "+5 this week", "color": "yellow"}
    ]

def get_recent_activities(counselor_id):
    # This would query an `activity_logs` collection or aggregate from various collections.
    # For now, placeholder data
    return [
        {"id": 1, "type": "session", "student": "Alex Thompson", "action": "Completed career assessment session", "time": "2 hours ago", "outcome": "Positive"},
        {"id": 2, "type": "recommendation", "student": "Lisa Park", "action": "Generated college recommendation list", "time": "4 hours ago", "outcome": "Delivered"},
        {"id": 3, "type": "appointment", "student": "David Kim", "action": "Scheduled follow-up appointment", "time": "1 day ago", "outcome": "Confirmed"},
        {"id": 4, "type": "alert", "student": "Jordan Miller", "action": "Flagged for academic support", "time": "2 days ago", "outcome": "Action Needed"}
    ]

def get_priority_students(counselor_id):
    # Fetch students assigned to this counselor who have 'High' or 'Medium' risk levels
    students_cursor = mongo.db.users.find(
        {"role": "student", "assigned_counselor_id": ObjectId(counselor_id), "risk_level": {"$in": ["High", "Medium"]}}
    ).sort("risk_level", -1).limit(5) # Top 5 priority students

    priority_students_list = []
    for s_data in students_cursor:
        student_id = str(s_data['_id'])
        # Fetch their latest appointment to show 'lastSession' and 'nextAppointment'
        last_session = mongo.db.appointments.find_one(
            {"student_id": ObjectId(student_id), "status": "completed"},
            sort=[("date", -1), ("time", -1)]
        )
        next_appointment = mongo.db.appointments.find_one(
            {"student_id": ObjectId(student_id), "status": {"$in": ["pending", "confirmed"]}, "date": {"$gte": datetime.now().date()}},
            sort=[("date", 1), ("time", 1)]
        )

        priority_students_list.append({
            "id": student_id,
            "name": f"{s_data.get('first_name', '')} {s_data.get('last_name', '')}",
            "grade": s_data.get('grade', 'N/A'),
            "riskLevel": s_data.get('risk_level', 'Low'),
            "lastSession": last_session['date'].strftime('%b %d, %Y') if last_session else "N/A",
            "nextAppointment": f"{next_appointment['date'].strftime('%b %d')} {next_appointment['time']}" if next_appointment else "No upcoming",
            "concerns": s_data.get('concerns', ["General Check-in"]), # Assuming concerns might be on User model or derived
            "gpa": s_data.get('gpa', 0.0),
            "attendance": 90, # Mock
            "avatar": (s_data.get('first_name', '')[0] + s_data.get('last_name', '')[0]).upper() if s_data.get('first_name') and s_data.get('last_name') else "S"
        })
    return priority_students_list


# --- Routes ---

@counselor_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_counselor_profile():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    counselor = User.find_by_id(counselor_id)
    if not counselor:
        return jsonify({"msg": "Counselor not found"}), 404

    return jsonify(counselor.to_dict()), 200

@counselor_bp.route('/dashboard_summary', methods=['GET'])
@jwt_required()
def get_counselor_dashboard_summary():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']
    
    counselor_profile = User.find_by_id(counselor_id)
    if not counselor_profile:
        return jsonify({"msg": "Counselor profile not found"}), 404

    timeframe = request.args.get('timeframe', 'month') # week, month, quarter

    # Aggregate all data for the dashboard
    kpi_data = get_counselor_kpis(counselor_id, timeframe)
    engagement_analytics = get_student_engagement_analytics(counselor_id)
    session_effectiveness = get_session_effectiveness_data(counselor_id)
    achievement_metrics = get_achievement_metrics(counselor_id)
    career_interest_distribution = get_career_interest_distribution(counselor_id)
    priority_students = get_priority_students(counselor_id)
    recent_activities = get_recent_activities(counselor_id)
    
    # Upcoming appointments for sidebar
    today = date.today()
    upcoming_appointments_db = mongo.db.appointments.find({
        "counselor_id": ObjectId(counselor_id),
        "date": {"$gte": today},
        "status": {"$in": ["pending", "confirmed"]}
    }).sort([("date", 1), ("time", 1)]).limit(3) # Get top 3 for sidebar
    
    upcoming_appointments = []
    for app in upcoming_appointments_db:
        upcoming_appointments.append({
            "id": str(app['_id']),
            "student": User.find_by_id(str(app['student_id'])).first_name if User.find_by_id(str(app['student_id'])) else "Unknown Student",
            "time": f"{app['date'].strftime('%b %d')}, {app['time']}",
            "type": app['type'],
            "duration": f"{app['duration_minutes']} min",
            "priority": app['priority'],
            "status": app['status']
        })


    return jsonify({
        "counselor_profile": counselor_profile.to_dict(),
        "kpi_data": kpi_data,
        "student_engagement_analytics": engagement_analytics,
        "session_effectiveness_data": session_effectiveness,
        "achievement_metrics": achievement_metrics,
        "career_interest_distribution": career_interest_distribution,
        "priority_students": priority_students,
        "recent_activities": recent_activities,
        "upcoming_appointments": upcoming_appointments
    }), 200

@counselor_bp.route('/students', methods=['GET'])
@jwt_required()
def get_assigned_students():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    # Filters (e.g., by risk_level, grade) can be added from request.args
    query = {"role": "student", "assigned_counselor_id": ObjectId(counselor_id)}

    students_cursor = mongo.db.users.find(query).sort([("last_name", 1), ("first_name", 1)])
    
    students_list = []
    for s_data in students_cursor:
        student = User(email=s_data['email'], password='dummy', role=s_data['role'], first_name=s_data.get('first_name'), last_name=s_data.get('last_name'), **s_data)
        student._id = s_data['_id'] # Manually set _id
        
        # Fetch latest session for last_login info
        last_session_info = mongo.db.appointments.find_one(
            {"student_id": student._id, "status": "completed"},
            sort=[("date", -1)]
        )
        last_session_str = last_session_info['date'].strftime('%b %d, %Y') if last_session_info else "N/A"
        
        student_dict = student.to_dict()
        student_dict['last_session'] = last_session_str
        students_list.append(student_dict)
        
    return jsonify(students_list), 200

@counselor_bp.route('/students/<student_id>', methods=['GET'])
@jwt_required()
def get_single_student_details(student_id):
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    student = User.find_by_id(student_id)
    if not student or str(student.assigned_counselor_id) != counselor_id:
        return jsonify({"msg": "Student not found or not assigned to this counselor"}), 404
    
    student_data = student.to_dict()
    
    # Fetch additional related data
    academic_records = [rec.to_dict() for rec in AcademicRecord.find_by_student_id(student_id)]
    assessments_results = [res.to_dict() for res in mongo.db.assessment_results.find({"student_id": ObjectId(student_id)}).sort("submission_date", -1)]
    recommendations = [rec.to_dict() for rec in mongo.db.recommendations.find({"student_id": ObjectId(student_id)}).sort("created_at", -1)]
    appointments = [app.to_dict() for app in mongo.db.appointments.find({"student_id": ObjectId(student_id)}).sort([("date", 1), ("time", 1)])]

    student_data['academic_records'] = academic_records
    student_data['assessment_results'] = assessments_results
    student_data['recommendations'] = recommendations
    student_data['appointments'] = appointments

    return jsonify(student_data), 200

@counselor_bp.route('/appointments', methods=['GET'])
@jwt_required()
def get_counselor_appointments():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    # Query parameters for filtering
    status_filter = request.args.get('status')
    start_date_str = request.args.get('start_date')
    end_date_str = request.args.get('end_date')

    query = {"counselor_id": ObjectId(counselor_id)}

    if status_filter:
        query['status'] = status_filter
    if start_date_str:
        query['date'] = {"$gte": datetime.strptime(start_date_str, '%Y-%m-%d').date()}
    if end_date_str:
        if 'date' in query:
            query['date']['$lte'] = datetime.strptime(end_date_str, '%Y-%m-%d').date()
        else:
            query['date'] = {"$lte": datetime.strptime(end_date_str, '%Y-%m-%d').date()}

    appointments_cursor = mongo.db.appointments.find(query).sort([("date", 1), ("time", 1)])
    
    appointments_list = []
    for app_data in appointments_cursor:
        app = Appointment(student_id=str(app_data['student_id']), counselor_id=str(app_data['counselor_id']), date=app_data['date'], time=app_data['time'], duration_minutes=app_data['duration_minutes'], type=app_data['type'], notes_by_student=app_data.get('notes_by_student', ''), **app_data)
        appointments_list.append(app.to_dict())
        
    return jsonify(appointments_list), 200

@counselor_bp.route('/appointments/<appointment_id>/status', methods=['PUT'])
@jwt_required()
def update_appointment_status(appointment_id):
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    data = request.get_json()
    new_status = data.get('status')
    if not new_status or new_status not in ["pending", "confirmed", "completed", "cancelled"]:
        return jsonify({"msg": "Invalid status provided"}), 400

    try:
        result = mongo.db.appointments.update_one(
            {"_id": ObjectId(appointment_id), "counselor_id": ObjectId(counselor_id)},
            {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Appointment not found or not assigned to this counselor"}), 404
        return jsonify({"msg": "Appointment status updated successfully"}), 200
    except Exception as e:
        return jsonify({"msg": f"Error updating appointment status: {str(e)}"}), 500

@counselor_bp.route('/recommendations', methods=['GET'])
@jwt_required()
def get_counselor_recommendations():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    # Find students assigned to this counselor
    assigned_student_ids = [s['_id'] for s in mongo.db.users.find({"assigned_counselor_id": ObjectId(counselor_id)}, {"_id": 1})]
    
    # Get recommendations either created by this counselor or for their assigned students
    recommendations_cursor = mongo.db.recommendations.find({
        "$or": [
            {"counselor_id": ObjectId(counselor_id)},
            {"student_id": {"$in": assigned_student_ids}}
        ]
    }).sort("created_at", -1)

    recs_list = []
    for rec_data in recommendations_cursor:
        rec = Recommendation(student_id=str(rec_data['student_id']), **rec_data)
        recs_list.append(rec.to_dict())
    
    return jsonify(recs_list), 200

@counselor_bp.route('/recommendations/generate/<student_id>', methods=['POST'])
@jwt_required()
def generate_recommendation_for_student(student_id):
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    student = User.find_by_id(student_id)
    if not student or str(student.assigned_counselor_id) != counselor_id:
        return jsonify({"msg": "Student not found or not assigned to this counselor"}), 404

    # --- Placeholder for Recommendation Engine Call ---
    # In a real application, you would call your recommendation engine service here
    # (e.g., from services/recommendation_engine.py)
    # This engine would take student's academic_records, interests, assessment_results etc.
    # and return actual course/career recommendations.

    mock_rec_summary = f"Based on {student.first_name}'s profile, strong potential in STEM fields."
    mock_courses = [{"course_id": str(ObjectId()), "name": "Advanced Data Science"}, {"course_id": str(ObjectId()), "name": "AI Ethics"}]
    mock_skills = [{"skill_id": str(ObjectId()), "name": "Python Proficiency", "level": 85}]

    try:
        new_recommendation = Recommendation(
            student_id=student_id,
            counselor_id=counselor_id,
            type="Career Path",
            match_score=random.randint(80, 99),
            summary=mock_rec_summary,
            generated_by="Counselor-Triggered AI",
            recommended_courses=mock_courses,
            suggested_skills=mock_skills,
            status="Generated"
        )
        rec_id = new_recommendation.save()
        return jsonify({"msg": "Recommendation generated and saved", "recommendation_id": str(rec_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error generating recommendation: {e}")
        return jsonify({"msg": f"Error generating recommendation: {str(e)}"}), 500

@counselor_bp.route('/quick_stats', methods=['GET'])
@jwt_required()
def get_counselor_quick_stats():
    error = check_counselor_role()
    if error: return error

    current_user_identity = get_jwt_identity()
    counselor_id = current_user_identity['id']

    today = date.today()
    this_week_start = today - timedelta(days=today.weekday()) # Monday
    
    today_sessions = mongo.db.appointments.count_documents({
        "counselor_id": ObjectId(counselor_id),
        "date": today,
        "status": {"$in": ["confirmed", "completed"]}
    })
    
    this_week_sessions = mongo.db.appointments.count_documents({
        "counselor_id": ObjectId(counselor_id),
        "date": {"$gte": this_week_start, "$lte": today},
        "status": {"$in": ["confirmed", "completed"]}
    })

    # Mock completion rate and avg duration
    completion_rate = 94 # Mock
    avg_duration = 42 # Mock

    return jsonify({
        "today_sessions": today_sessions,
        "this_week_sessions": this_week_sessions,
        "completion_rate": completion_rate,
        "avg_duration": avg_duration
    }), 200

# Additional Analytics endpoints can be added here as needed for specific charts