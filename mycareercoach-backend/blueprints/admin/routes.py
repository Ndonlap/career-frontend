from flask import jsonify, request, current_app
from blueprints.admin import admin_bp
from extensions import jwt, mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import random

# Import models
from auth.models import User
from blueprints.shared.models import AcademicRecord, Course, Career, Skill, Appointment, Recommendation
from blueprints.assessments.models import Assessment, AssessmentResult
from blueprints.public_content.models import PublicContent, SystemSettings

# --- Helper Functions for Authorization ---
def check_admin_role():
    identity = get_jwt_identity()
    if identity.get('role') != 'admin':
        return jsonify({"msg": "Access denied: Admins only"}), 403
    return None # No error

# --- Helper Functions for Data Aggregation (can be moved to services/admin_service.py) ---

def get_dashboard_kpis():
    total_users = mongo.db.users.count_documents({})
    total_students = mongo.db.users.count_documents({"role": "student"})
    active_users = mongo.db.users.count_documents({"status": "active"}) # Simplified
    courses_offered = mongo.db.courses.count_documents({"status": "active"})
    career_paths = mongo.db.careers.count_documents({})

    # Mock revenue and uptime for now
    total_revenue = 1004971 # Mock
    placement_rate = 89.2 # Mock
    system_uptime = 99.8 # Mock

    # Mock user change for KPI card
    user_change_percent = -0.4 # Mock

    return {
        "totalUsers": total_users,
        "totalStudents": total_students,
        "totalRevenue": total_revenue,
        "activeUsers": active_users,
        "coursesOffered": courses_offered,
        "careerPaths": career_paths,
        "placementRate": placement_rate,
        "systemUptime": system_uptime,
        "userChangePercent": user_change_percent
    }

def get_popular_courses_data():
    # In a real app, this would aggregate `courses` by `students_enrolled_count`
    # or `enrollment_metrics` to find the most popular.
    # For now, return mock data matching frontend.
    return [
        {"name": "UX/UI Design", "students": 4226, "color": "#FF6B6B", "progress": 95},
        {"name": "Android Development", "students": 3845, "color": "#4ECDC4", "progress": 87},
        {"name": "iOS Development", "students": 3501, "color": "#45B7D1", "progress": 82},
        {"name": "Graphic Design", "students": 2431, "color": "#96CEB4", "progress": 68},
        {"name": "Data Science", "students": 3892, "color": "#FECA57", "progress": 91},
        {"name": "Cybersecurity", "students": 2156, "color": "#FF9FF3", "progress": 72}
    ]

def get_user_growth_analytics():
    # This would involve time-series aggregation on the `users` collection's `join_date`
    # For now, return mock data.
    return [
        {"month": "Jan", "students": 25430, "counselors": 245, "admins": 12},
        {"month": "Feb", "students": 27891, "counselors": 267, "admins": 13},
        {"month": "Mar", "students": 30245, "counselors": 289, "admins": 14},
        {"month": "Apr", "students": 32678, "counselors": 312, "admins": 15},
        {"month": "May", "students": 35124, "counselors": 334, "admins": 16},
        {"month": "Jun", "students": 37589, "counselors": 356, "admins": 17}
    ]

def get_reports_summary():
    # Aggregate from a `reports` collection if you implement specific report generation.
    # For now, mock data matching frontend.
    total_generated = mongo.db.academic_records.count_documents({"uploaded_report_card": {"$ne": None}}) + \
                      mongo.db.assessment_results.count_documents({}) + \
                      mongo.db.recommendations.count_documents({}) # Simplified counts
    return {
        "total_reports": total_generated,
        "analytical": mongo.db.assessment_results.count_documents({}), # Example count
        "proposal": mongo.db.recommendations.count_documents({}), # Example count
        "undefined": total_generated - (mongo.db.assessment_results.count_documents({}) + mongo.db.recommendations.count_documents({})), # Remaining
        "new_analytical_count": 115, # Mock
        "new_proposal_count": 247, # Mock
        "new_undefined_count": 362 # Mock
    }

def get_last_students_activity():
    # This would aggregate recent activity from `academic_records`, `appointments`, `assessment_results`
    # For now, mock data.
    return [
        {"name": "Kristin Watson", "subject": "UX/UI Design", "date": "Jul 28, 2021", "avatar": "KW"},
        {"name": "Devon Lane", "subject": "iOS development", "date": "Jul 22, 2021", "avatar": "DL"},
        {"name": "Albert Flores", "subject": "Graphic design", "date": "Jul 21, 2021", "avatar": "AF"}
    ]

def get_system_usage_distribution():
    # This would pull counts from various collections or a system logs collection.
    # For now, mock data matching frontend.
    return [
        {"name": "Active Sessions", "value": 1784, "color": "#4285F4"},
        {"name": "Completed Assessments", "value": mongo.db.assessment_results.count_documents({}), "color": "#34A853"},
        {"name": "Generated Reports", "value": mongo.db.recommendations.count_documents({}), "color": "#FBBC05"}, # Example
        {"name": "Pending Reviews", "value": mongo.db.appointments.count_documents({"status": "pending"}), "color": "#EA4335"}
    ]


# --- Admin Dashboard Overview Route ---

@admin_bp.route('/dashboard_overview', methods=['GET'])
@jwt_required()
def get_admin_dashboard_overview():
    error = check_admin_role()
    if error: return error

    # Aggregate all data for the main admin dashboard view
    dashboard_kpis = get_dashboard_kpis()
    popular_courses = get_popular_courses_data()
    user_growth_analytics = get_user_growth_analytics()
    reports_summary = get_reports_summary()
    last_students_activity = get_last_students_activity()
    system_usage_distribution = get_system_usage_distribution()

    response_data = {
        "kpis": dashboard_kpis,
        "popular_courses": popular_courses,
        "user_growth_analytics": user_growth_analytics,
        "reports_summary": reports_summary,
        "last_students_activity": last_students_activity,
        "system_usage_distribution": system_usage_distribution, # For the pie chart on analytics page too
    }
    return jsonify(response_data), 200

# --- User Management ---

@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    error = check_admin_role()
    if error: return error

    role_filter = request.args.get('role')
    status_filter = request.args.get('status')
    search_query = request.args.get('search')
    
    query = {}
    if role_filter:
        query['role'] = role_filter
    if status_filter:
        query['status'] = status_filter
    if search_query:
        # Simple text search on name or email
        query['$or'] = [
            {"first_name": {"$regex": search_query, "$options": "i"}},
            {"last_name": {"$regex": search_query, "$options": "i"}},
            {"email": {"$regex": search_query, "$options": "i"}}
        ]

    users_cursor = mongo.db.users.find(query).sort([("last_name", 1), ("first_name", 1)])
    users_list = []
    for user_data in users_cursor:
        # Reconstruct User object to use to_dict, but without password hash
        user = User(email=user_data['email'], password='dummy_password', role=user_data['role'],
                    first_name=user_data.get('first_name'), last_name=user_data.get('last_name'), **user_data)
        user._id = user_data['_id'] # Ensure _id is set for to_dict
        user.password_hash = user_data['password_hash'] # For check_password if needed later, but not in to_dict
        users_list.append(user.to_dict())
    
    return jsonify(users_list), 200

@admin_bp.route('/users', methods=['POST'])
@jwt_required()
def create_new_user():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not all([email, password, role, first_name, last_name]):
        return jsonify({"msg": "Missing required fields for new user"}), 400

    if User.find_by_email(email):
        return jsonify({"msg": "User with that email already exists"}), 409

    try:
        new_user = User(email=email, password=password, role=role, first_name=first_name, last_name=last_name, **data)
        user_id = new_user.save()
        return jsonify({"msg": "User created successfully", "user_id": str(user_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating user: {e}")
        return jsonify({"msg": f"Error creating user: {str(e)}"}), 500

@admin_bp.route('/users/<user_id>', methods=['GET'])
@jwt_required()
def get_user_details(user_id):
    error = check_admin_role()
    if error: return error

    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    update_data = {}

    # Basic fields for all users
    if 'email' in data: update_data['email'] = data['email']
    if 'first_name' in data: update_data['first_name'] = data['first_name']
    if 'last_name' in data: update_data['last_name'] = data['last_name']
    if 'role' in data: update_data['role'] = data['role']
    if 'status' in data: update_data['status'] = data['status']
    if 'password' in data: # Handle password change carefully
        update_data['password_hash'] = User(email="dummy@example.com", password=data['password'], role="dummy", first_name="dummy", last_name="dummy").password_hash
    
    # Role-specific fields (admin will typically manage these)
    user_to_update = User.find_by_id(user_id)
    if not user_to_update:
        return jsonify({"msg": "User not found"}), 404
    
    if user_to_update.role == "student":
        if 'school' in data: update_data['school'] = data['school']
        if 'grade' in data: update_data['grade'] = data['grade']
        if 'gpa' in data: update_data['gpa'] = data['gpa']
        if 'risk_level' in data: update_data['risk_level'] = data['risk_level']
        if 'interests' in data: update_data['interests'] = data['interests']
        if 'assigned_counselor_id' in data: update_data['assigned_counselor_id'] = ObjectId(data['assigned_counselor_id']) if data['assigned_counselor_id'] else None
    elif user_to_update.role == "counselor":
        if 'specialization' in data: update_data['specialization'] = data['specialization']
        if 'bio' in data: update_data['bio'] = data['bio']
        if 'contact_phone' in data: update_data['contact_phone'] = data['contact_phone']
        if 'availability' in data: update_data['availability'] = data['availability']


    if not update_data:
        return jsonify({"msg": "No data provided for update"}), 400

    update_data['updated_at'] = datetime.utcnow() # Assuming User model has updated_at

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "User not found"}), 404
        return jsonify({"msg": "User updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating user: {e}")
        return jsonify({"msg": f"Error updating user: {str(e)}"}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    error = check_admin_role()
    if error: return error

    try:
        result = mongo.db.users.delete_one({"_id": ObjectId(user_id)})
        if result.deleted_count == 0:
            return jsonify({"msg": "User not found"}), 404
        
        # Optional: Cascade delete related data (e.g., academic_records, appointments, recommendations)
        # This can be complex and should be carefully designed.
        # mongo.db.academic_records.delete_many({"student_id": ObjectId(user_id)})
        # mongo.db.appointments.delete_many({"$or": [{"student_id": ObjectId(user_id)}, {"counselor_id": ObjectId(user_id)}]})
        # mongo.db.recommendations.delete_many({"$or": [{"student_id": ObjectId(user_id)}, {"counselor_id": ObjectId(user_id)}]})

        return jsonify({"msg": "User deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting user: {e}")
        return jsonify({"msg": f"Error deleting user: {str(e)}"}), 500

@admin_bp.route('/user_stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    error = check_admin_role()
    if error: return error

    active_students = mongo.db.users.count_documents({"role": "student", "status": "active"})
    active_counselors = mongo.db.users.count_documents({"role": "counselor", "status": "active"})
    system_admins = mongo.db.users.count_documents({"role": "admin", "status": "active"})
    inactive_users = mongo.db.users.count_documents({"status": "inactive"}) # Or also "suspended"

    return jsonify({
        "active_students": active_students,
        "active_counselors": active_counselors,
        "system_admins": system_admins,
        "inactive_users": inactive_users
    }), 200


# --- Course Management ---

@admin_bp.route('/courses', methods=['GET'])
@jwt_required()
def get_all_courses_admin():
    error = check_admin_role()
    if error: return error

    courses_cursor = mongo.db.courses.find({})
    courses_list = [Course(**c).to_dict() for c in courses_cursor]
    return jsonify(courses_list), 200

@admin_bp.route('/courses', methods=['POST'])
@jwt_required()
def create_course():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    category = data.get('category')
    instructor = data.get('instructor')
    duration = data.get('duration')

    if not all([title, description, category, instructor, duration]):
        return jsonify({"msg": "Missing required fields for course"}), 400
    
    try:
        new_course = Course(title=title, description=description, category=category, instructor=instructor, duration=duration, **data)
        course_id = new_course.save()
        return jsonify({"msg": "Course created successfully", "course_id": str(course_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating course: {e}")
        return jsonify({"msg": f"Error creating course: {str(e)}"}), 500

@admin_bp.route('/courses/<course_id>', methods=['PUT'])
@jwt_required()
def update_course(course_id):
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided for update"}), 400

    update_data = {k: v for k, v in data.items() if k not in ['_id', 'created_at']}
    update_data['updated_at'] = datetime.utcnow()

    # Handle ObjectId conversion for related_careers if needed
    if 'related_careers' in update_data:
        update_data['related_careers'] = [ObjectId(cid) for cid in update_data['related_careers']]

    try:
        result = mongo.db.courses.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Course not found"}), 404
        return jsonify({"msg": "Course updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating course: {e}")
        return jsonify({"msg": f"Error updating course: {str(e)}"}), 500

@admin_bp.route('/courses/<course_id>', methods=['DELETE'])
@jwt_required()
def delete_course(course_id):
    error = check_admin_role()
    if error: return error

    try:
        result = mongo.db.courses.delete_one({"_id": ObjectId(course_id)})
        if result.deleted_count == 0:
            return jsonify({"msg": "Course not found"}), 404
        return jsonify({"msg": "Course deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting course: {e}")
        return jsonify({"msg": f"Error deleting course: {str(e)}"}), 500

@admin_bp.route('/course_analytics', methods=['GET'])
@jwt_required()
def get_course_analytics():
    error = check_admin_role()
    if error: return error

    total_courses = mongo.db.courses.count_documents({})
    total_enrolled_students = mongo.db.courses.aggregate([
        {"$group": {"_id": None, "total_enrolled": {"$sum": "$students_enrolled_count"}}}
    ])
    total_enrolled_students = list(total_enrolled_students)[0]['total_enrolled'] if list(total_enrolled_students) else 0

    # Mock completion rate and avg rating
    completion_rate = 87.3
    average_rating = 4.6

    return jsonify({
        "total_courses": total_courses,
        "total_enrolled_students": total_enrolled_students,
        "completion_rate": completion_rate,
        "average_rating": average_rating
    }), 200

# --- Career Path Management ---

@admin_bp.route('/careers', methods=['GET'])
@jwt_required()
def get_all_careers_admin():
    error = check_admin_role()
    if error: return error

    careers_cursor = mongo.db.careers.find({})
    careers_list = [Career(**c).to_dict() for c in careers_cursor]
    return jsonify(careers_list), 200

@admin_bp.route('/careers', methods=['POST'])
@jwt_required()
def create_career():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    industry = data.get('industry')
    market_demand = data.get('market_demand', 0)
    growth_rate = data.get('growth_rate', 0)
    avg_salary = data.get('avg_salary', 0)

    if not all([title, description, industry]):
        return jsonify({"msg": "Missing required fields for career"}), 400
    
    try:
        new_career = Career(title=title, description=description, industry=industry, 
                            market_demand=market_demand, growth_rate=growth_rate, avg_salary=avg_salary, **data)
        career_id = new_career.save()
        return jsonify({"msg": "Career path created successfully", "career_id": str(career_id)}), 201
    except Exception as e:
        current_app.logger.error(f"Error creating career: {e}")
        return jsonify({"msg": f"Error creating career: {str(e)}"}), 500

@admin_bp.route('/careers/<career_id>', methods=['PUT'])
@jwt_required()
def update_career(career_id):
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided for update"}), 400

    update_data = {k: v for k, v in data.items() if k not in ['_id', 'created_at']}
    update_data['updated_at'] = datetime.utcnow()

    # Handle ObjectId conversion for required_skills, educational_paths if needed
    if 'required_skills' in update_data:
        update_data['required_skills'] = [ObjectId(sid) for sid in update_data['required_skills']]
    if 'educational_paths' in update_data:
        update_data['educational_paths'] = [ObjectId(cid) for cid in update_data['educational_paths']]

    try:
        result = mongo.db.careers.update_one(
            {"_id": ObjectId(career_id)},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Career not found"}), 404
        return jsonify({"msg": "Career updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating career: {e}")
        return jsonify({"msg": f"Error updating career: {str(e)}"}), 500

@admin_bp.route('/careers/<career_id>', methods=['DELETE'])
@jwt_required()
def delete_career(career_id):
    error = check_admin_role()
    if error: return error

    try:
        result = mongo.db.careers.delete_one({"_id": ObjectId(career_id)})
        if result.deleted_count == 0:
            return jsonify({"msg": "Career not found"}), 404
        return jsonify({"msg": "Career deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting career: {e}")
        return jsonify({"msg": f"Error deleting career: {str(e)}"}), 500

@admin_bp.route('/career_analytics', methods=['GET'])
@jwt_required()
def get_career_analytics():
    error = check_admin_role()
    if error: return error

    total_career_paths = mongo.db.careers.count_documents({})
    # Mock other stats
    placement_rate = 89.2
    avg_starting_salary = 98000
    industry_partners = 156

    return jsonify({
        "total_career_paths": total_career_paths,
        "placement_rate": placement_rate,
        "avg_starting_salary": avg_starting_salary,
        "industry_partners": industry_partners
    }), 200

@admin_bp.route('/career_trends', methods=['GET'])
@jwt_required()
def get_career_trends():
    error = check_admin_role()
    if error: return error

    # Return mock data matching frontend, or aggregate real career data
    return jsonify([
        {"field": "Technology", "demand": 94, "growth": 23, "avgSalary": 125000},
        {"field": "Healthcare", "demand": 89, "growth": 18, "avgSalary": 98000},
        {"field": "Finance", "demand": 76, "growth": 12, "avgSalary": 115000},
        {"field": "Education", "demand": 68, "growth": 8, "avgSalary": 67000},
        {"field": "Marketing", "demand": 72, "growth": 15, "avgSalary": 78000}
    ]), 200

# --- System Analytics ---

@admin_bp.route('/system_health_metrics', methods=['GET'])
@jwt_required()
def get_system_health_metrics():
    error = check_admin_role()
    if error: return error

    # Mock these values as they depend on actual server/DB monitoring
    return jsonify({
        "system_uptime": 99.8,
        "avg_response_time": 1.2,
        "database_usage": 73.2,
        "daily_active_users": 45.6
    }), 200

@admin_bp.route('/system_usage_distribution', methods=['GET'])
@jwt_required()
def get_system_usage_distribution_analytics():
    error = check_admin_role()
    if error: return error

    # This pulls from the helper function, which currently mocks or uses basic counts
    data = get_system_usage_distribution()
    return jsonify(data), 200

@admin_bp.route('/user_engagement_trends', methods=['GET'])
@jwt_required()
def get_user_engagement_trends_analytics():
    error = check_admin_role()
    if error: return error

    # This pulls from the helper function, which currently mocks data
    data = get_user_growth_analytics() # Reuse user growth for this chart as well
    return jsonify(data), 200

# --- System Configuration ---

@admin_bp.route('/settings', methods=['GET'])
@jwt_required()
def get_system_settings():
    error = check_admin_role()
    if error: return error

    settings = SystemSettings.get_settings()
    if not settings:
        # Create default settings if none exist
        default_settings = SystemSettings(platform_name="MyCareerCoach")
        default_settings.save()
        settings = default_settings
    
    return jsonify(settings.to_dict()), 200

@admin_bp.route('/settings', methods=['PUT'])
@jwt_required()
def update_system_settings():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    if not data:
        return jsonify({"msg": "No data provided for update"}), 400

    settings = SystemSettings.get_settings()
    if not settings:
        return jsonify({"msg": "System settings not found"}), 404 # Should not happen if get_settings creates default

    # Update fields
    for key, value in data.items():
        if hasattr(settings, key) and key not in ['_id', 'created_at']: # Prevent changing _id
            setattr(settings, key, value)
    
    settings.updated_at = datetime.utcnow()
    
    try:
        settings.save() # This uses upsert, effectively updating
        return jsonify({"msg": "System settings updated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating system settings: {e}")
        return jsonify({"msg": f"Error updating system settings: {str(e)}"}), 500