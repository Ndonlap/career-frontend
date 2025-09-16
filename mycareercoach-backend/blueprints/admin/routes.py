from flask import jsonify, request, current_app,send_file
from blueprints.admin import admin_bp
from extensions import jwt, mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timedelta
import random
import json
import os

# Import models
from auth.models import User
from blueprints.shared.models import AcademicRecord, Course, Career, Skill, Appointment, Recommendation
from blueprints.assessments.models import Assessment, AssessmentResult
from blueprints.public_content.models import PublicContent, SystemSettings


# --- Helper Functions for Authorization ---
def check_admin_role():
    current_user_identity_str = get_jwt_identity()
    current_user_identity = json.loads(current_user_identity_str)
    if current_user_identity.get('role') != 'admin':
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
        query['$or'] = [
            {"first_name": {"$regex": search_query, "$options": "i"}},
            {"last_name": {"$regex": search_query, "$options": "i"}},
            {"email": {"$regex": search_query, "$options": "i"}}
        ]

    users_cursor = mongo.db.users.find(query).sort([("last_name", 1), ("first_name", 1)])
    users_list = []
    for user_data in users_cursor:
        kwargs = user_data.copy()
        fields_to_remove = ["email", "password_hash", "role", "first_name", "last_name"]
        for field in fields_to_remove:
            kwargs.pop(field, None)
        
        user = User(
            email=user_data['email'], 
            password='dummy_password',
            role=user_data['role'],
            first_name=user_data.get('first_name'), 
            last_name=user_data.get('last_name'), 
            **kwargs
        )
        user._id = user_data['_id']
        user.password_hash = user_data.get('password_hash', '')
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
        return jsonify({"msg": "Missing required fields: email, password, role, first_name, last_name"}), 400

    if User.find_by_email(email):
        return jsonify({"msg": "User with that email already exists"}), 409

    try:
        # Extract role-specific data
        user_data = {k: v for k, v in data.items() if k not in ['email', 'password', 'role', 'first_name', 'last_name']}
        
        new_user = User(
            email=email, 
            password=password, 
            role=role, 
            first_name=first_name, 
            last_name=last_name, 
            **user_data
        )
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
    if not data:
        return jsonify({"msg": "No data provided for update"}), 400

    # Find user first to check current role
    user_to_update = User.find_by_id(user_id)
    if not user_to_update:
        return jsonify({"msg": "User not found"}), 404

    update_data = {}
    
    # Basic fields for all users
    basic_fields = ['email', 'first_name', 'last_name', 'role', 'status']
    for field in basic_fields:
        if field in data:
            update_data[field] = data[field]
    
    # Handle password change
    if 'password' in data and data['password']:
        update_data['password_hash'] = generate_password_hash(data['password'])
    
    # Role-specific fields
    if user_to_update.role == "student" or data.get('role') == "student":
        student_fields = ['school', 'grade', 'gpa', 'class_rank', 'total_students_in_class', 
                         'credits_completed', 'total_credits_required', 'average_grade', 
                         'risk_level', 'interests', 'assigned_counselor_id']
        for field in student_fields:
            if field in data:
                if field == 'assigned_counselor_id' and data[field]:
                    update_data[field] = ObjectId(data[field])
                else:
                    update_data[field] = data[field]
    
    elif user_to_update.role == "counselor" or data.get('role') == "counselor":
        counselor_fields = ['specialization', 'rating', 'bio', 'contact_phone', 
                           'contact_email', 'availability']
        for field in counselor_fields:
            if field in data:
                update_data[field] = data[field]

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
        
        # Optional: Cascade delete related data
        # mongo.db.appointments.delete_many({
        #     "$or": [
        #         {"student_id": ObjectId(user_id)},
        #         {"counselor_id": ObjectId(user_id)}
        #     ]
        # })
        
        return jsonify({"msg": "User deleted successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting user: {e}")
        return jsonify({"msg": f"Error deleting user: {str(e)}"}), 500

@admin_bp.route('/users/<user_id>/suspend', methods=['POST'])
@jwt_required()
def suspend_user(user_id):
    error = check_admin_role()
    print(user_id)
    if error:
        print(error)
        return error

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": "suspended", "updated_at": datetime.utcnow()}}
        )
        print(result)
        if result.matched_count == 0:
            return jsonify({"msg": "User not found"}), 404
        return jsonify({"msg": "User suspended successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error suspending user: {e}")
        return jsonify({"msg": f"Error suspending user: {str(e)}"}), 500

@admin_bp.route('/users/<user_id>/reactivate', methods=['POST'])
@jwt_required()
def reactivate_user(user_id):
    error = check_admin_role()
    if error: return error

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"status": "active", "updated_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "User not found"}), 404
        return jsonify({"msg": "User reactivated successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error reactivating user: {e}")
        return jsonify({"msg": f"Error reactivating user: {str(e)}"}), 500

@admin_bp.route('/user_stats', methods=['GET'])
@jwt_required()
def get_user_stats():
    error = check_admin_role()
    if error: return error

    try:
        active_students = mongo.db.users.count_documents({"role": "student", "status": "active"})
        active_counselors = mongo.db.users.count_documents({"role": "counselor", "status": "active"})
        system_admins = mongo.db.users.count_documents({"role": "admin", "status": "active"})
        suspended_users = mongo.db.users.count_documents({"status": "suspended"})
        inactive_users = mongo.db.users.count_documents({"status": "inactive"})
        
        # Get recent signups (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_signups = mongo.db.users.count_documents({
            "join_date": {"$gte": thirty_days_ago}
        })

        return jsonify({
            "active_students": active_students,
            "active_counselors": active_counselors,
            "system_admins": system_admins,
            "suspended_users": suspended_users,
            "inactive_users": inactive_users,
            "recent_signups": recent_signups
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error getting user stats: {e}")
        return jsonify({"msg": f"Error getting user stats: {str(e)}"}), 500

# NEW ROUTES

@admin_bp.route('/users/<user_id>/change_role', methods=['POST'])
@jwt_required()
def change_user_role(user_id):
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    new_role = data.get('role')
    
    if not new_role or new_role not in ['student', 'counselor', 'admin']:
        return jsonify({"msg": "Valid role required: student, counselor, or admin"}), 400

    try:
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"role": new_role, "updated_at": datetime.utcnow()}}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "User not found"}), 404
        return jsonify({"msg": f"User role changed to {new_role} successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error changing user role: {e}")
        return jsonify({"msg": f"Error changing user role: {str(e)}"}), 500

@admin_bp.route('/users/bulk_action', methods=['POST'])
@jwt_required()
def bulk_user_action():
    error = check_admin_role()
    if error: return error

    data = request.get_json()
    user_ids = data.get('user_ids', [])
    action = data.get('action')  # 'suspend', 'reactivate', 'delete'
    
    if not user_ids or not action:
        return jsonify({"msg": "User IDs and action required"}), 400
    
    if action not in ['suspend', 'reactivate', 'delete']:
        return jsonify({"msg": "Valid action required: suspend, reactivate, or delete"}), 400

    try:
        object_ids = [ObjectId(user_id) for user_id in user_ids]
        
        if action == 'delete':
            result = mongo.db.users.delete_many({"_id": {"$in": object_ids}})
            return jsonify({"msg": f"{result.deleted_count} users deleted successfully"}), 200
        else:
            new_status = "suspended" if action == 'suspend' else "active"
            result = mongo.db.users.update_many(
                {"_id": {"$in": object_ids}},
                {"$set": {"status": new_status, "updated_at": datetime.utcnow()}}
            )
            return jsonify({"msg": f"{result.modified_count} users {action}ed successfully"}), 200
    except Exception as e:
        current_app.logger.error(f"Error performing bulk action: {e}")
        return jsonify({"msg": f"Error performing bulk action: {str(e)}"}), 500

@admin_bp.route('/users/export', methods=['GET'])
@jwt_required()
def export_users():
    error = check_admin_role()
    if error: return error

    role_filter = request.args.get('role')
    status_filter = request.args.get('status')
    
    query = {}
    if role_filter:
        query['role'] = role_filter
    if status_filter:
        query['status'] = status_filter

    try:
        users_cursor = mongo.db.users.find(query).sort([("last_name", 1), ("first_name", 1)])
        users_list = []
        for user_data in users_cursor:
            user = User.find_by_id(str(user_data['_id']))
            if user:
                users_list.append(user.to_dict())
        
        # In a real implementation, you might convert this to CSV or Excel
        return jsonify({
            "count": len(users_list),
            "users": users_list
        }), 200
    except Exception as e:
        current_app.logger.error(f"Error exporting users: {e}")
        return jsonify({"msg": f"Error exporting users: {str(e)}"}), 500

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
    
    
# --- Academic Records Management ---

@admin_bp.route('/academic-records', methods=['GET'])
@jwt_required()
def get_all_academic_records():
    """Get all academic records with filtering options"""
    error = check_admin_role()
    if error:
        return error
    
    # Get query parameters
    student_id = request.args.get('student_id')
    term = request.args.get('term')
    year = request.args.get('year')
    status = request.args.get('status', 'all')  # all, pending, validated, rejected
    
    # Build query
    query = {}
    if student_id:
        query['student_id'] = ObjectId(student_id)
    if term:
        query['term'] = term
    if year:
        query['year'] = int(year)
    if status != 'all':
        query['validation_status'] = status
    
    try:
        # Get records with student information
        records_cursor = mongo.db.academic_records.aggregate([
            {"$match": query},
            {"$lookup": {
                "from": "users",
                "localField": "student_id",
                "foreignField": "_id",
                "as": "student"
            }},
            {"$unwind": "$student"},
            {"$sort": {"year": -1, "term": -1}},
            {"$project": {
                "student_id": 1,
                "term": 1,
                "year": 1,
                "average_score": 1,
                "subjects": 1,
                "uploaded_report_card": 1,
                "validation_status": 1,
                "validation_notes": 1,
                "validated_by": 1,
                "validated_at": 1,
                "created_at": 1,
                "updated_at": 1,
                "student_name": {"$concat": ["$student.first_name", " ", "$student.last_name"]},
                "student_email": "$student.email"
            }}
        ])
        
        records = list(records_cursor)
        
        # Convert ObjectId to string for JSON serialization
        for record in records:
            record['_id'] = str(record['_id'])
            record['student_id'] = str(record['student_id'])
            if 'validated_by' in record and record['validated_by']:
                record['validated_by'] = str(record['validated_by'])
        
        return jsonify(records), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching academic records: {e}")
        return jsonify({"msg": "Failed to fetch academic records"}), 500

@admin_bp.route('/academic-records/<record_id>', methods=['GET'])
@jwt_required()
def get_academic_record(record_id):
    """Get a specific academic record"""
    error = check_admin_role()
    if error:
        return error
    
    try:
        record = mongo.db.academic_records.find_one({"_id": ObjectId(record_id)})
        if not record:
            return jsonify({"msg": "Academic record not found"}), 404
        
        # Get student information
        student = mongo.db.users.find_one({"_id": record['student_id']})
        if student:
            record['student_name'] = f"{student.get('first_name', '')} {student.get('last_name', '')}"
            record['student_email'] = student.get('email', '')
        
        # Convert ObjectId to string
        record['_id'] = str(record['_id'])
        record['student_id'] = str(record['student_id'])
        if 'validated_by' in record and record['validated_by']:
            record['validated_by'] = str(record['validated_by'])
        
        return jsonify(record), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching academic record: {e}")
        return jsonify({"msg": "Failed to fetch academic record"}), 500

@admin_bp.route('/academic-records/<record_id>/download', methods=['GET'])
@jwt_required()
def download_report_card(record_id):
    """Download the uploaded report card file"""
    error = check_admin_role()
    if error:
        return error
    
    try:
        # Get the record
        record = mongo.db.academic_records.find_one({"_id": ObjectId(record_id)})
        if not record:
            return jsonify({"msg": "Academic record not found"}), 404
        
        # Check if report card exists
        if not record.get('uploaded_report_card'):
            return jsonify({"msg": "No report card uploaded for this record"}), 404
        print("record")
        print(record)
        file_path = record['uploaded_report_card']['file_path']
        filename = record['uploaded_report_card']['filename']
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({"msg": "Report card file not found"}), 404
        
        return send_file(file_path, as_attachment=True, download_name=filename)
        
    except Exception as e:
        current_app.logger.error(f"Error downloading report card: {e}")
        return jsonify({"msg": "Failed to download report card"}), 500

@admin_bp.route('/academic-records/<record_id>/validate', methods=['POST'])
@jwt_required()
def validate_record(record_id):
    """Validate an academic record"""
    error = check_admin_role()
    if error:
        return error
    
    data = request.get_json()
    notes = data.get('notes', '')
    
    try:
        # Get current user ID
        current_user_identity = get_jwt_identity()
        if isinstance(current_user_identity, str):
            current_user_identity = json.loads(current_user_identity)
        
        current_user_id = current_user_identity.get('id')
        
        # Update the record
        result = mongo.db.academic_records.update_one(
            {"_id": ObjectId(record_id)},
            {"$set": {
                "validation_status": "validated",
                "validation_notes": notes,
                "validated_by": ObjectId(current_user_id),
                "validated_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"msg": "Academic record not found"}), 404
        
        return jsonify({"msg": "Academic record validated successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error validating academic record: {e}")
        return jsonify({"msg": "Failed to validate academic record"}), 500

@admin_bp.route('/academic-records/<record_id>/reject', methods=['POST'])
@jwt_required()
def reject_record(record_id):
    """Reject an academic record"""
    error = check_admin_role()
    if error:
        return error
    
    data = request.get_json()
    notes = data.get('notes', '')
    
    if not notes:
        return jsonify({"msg": "Rejection notes are required"}), 400
    
    try:
        # Get current user ID
        current_user_identity = get_jwt_identity()
        if isinstance(current_user_identity, str):
            current_user_identity = json.loads(current_user_identity)
        
        current_user_id = current_user_identity.get('id')
        
        # Update the record
        result = mongo.db.academic_records.update_one(
            {"_id": ObjectId(record_id)},
            {"$set": {
                "validation_status": "rejected",
                "validation_notes": notes,
                "validated_by": ObjectId(current_user_id),
                "validated_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }}
        )
        
        if result.matched_count == 0:
            return jsonify({"msg": "Academic record not found"}), 404
        
        return jsonify({"msg": "Academic record rejected successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error rejecting academic record: {e}")
        return jsonify({"msg": "Failed to reject academic record"}), 500

@admin_bp.route('/academic-records/<record_id>', methods=['DELETE'])
@jwt_required()
def delete_academic_record(record_id):
    """Delete an academic record"""
    error = check_admin_role()
    if error:
        return error
    
    try:
        # Get the record to check for file deletion
        record = mongo.db.academic_records.find_one({"_id": ObjectId(record_id)})
        if not record:
            return jsonify({"msg": "Academic record not found"}), 404
        
        # Delete associated file if exists
        if record.get('uploaded_report_card') and os.path.exists(record['uploaded_report_card']['file_path']):
            try:
                os.remove(record['uploaded_report_card']['file_path'])
            except Exception as e:
                current_app.logger.error(f"Error deleting report card file: {e}")
        
        # Delete the record
        result = mongo.db.academic_records.delete_one({"_id": ObjectId(record_id)})
        
        if result.deleted_count == 0:
            return jsonify({"msg": "Academic record not found"}), 404
        
        return jsonify({"msg": "Academic record deleted successfully"}), 200
        
    except Exception as e:
        current_app.logger.error(f"Error deleting academic record: {e}")
        return jsonify({"msg": "Failed to delete academic record"}), 500

@admin_bp.route('/academic-records/stats', methods=['GET'])
@jwt_required()
def get_academic_records_stats():
    """Get statistics about academic records"""
    error = check_admin_role()
    if error:
        return error
    
    try:
        # Get total records count
        total_records = mongo.db.academic_records.count_documents({})
        
        # Get records by validation status
        status_stats = list(mongo.db.academic_records.aggregate([
            {"$group": {
                "_id": "$validation_status",
                "count": {"$sum": 1}
            }}
        ]))
        
        # Get records by term
        term_stats = list(mongo.db.academic_records.aggregate([
            {"$group": {
                "_id": "$term",
                "count": {"$sum": 1}
            }}
        ]))
        
        # Get average scores by year
        year_stats = list(mongo.db.academic_records.aggregate([
            {"$group": {
                "_id": "$year",
                "average_score": {"$avg": "$average_score"},
                "count": {"$sum": 1}
            }},
            {"$sort": {"_id": -1}}
        ]))
        
        stats = {
            "total_records": total_records,
            "by_status": {stat["_id"]: stat["count"] for stat in status_stats},
            "by_term": {stat["_id"]: stat["count"] for stat in term_stats},
            "by_year": [
                {
                    "year": stat["_id"],
                    "average_score": round(stat["average_score"], 2),
                    "count": stat["count"]
                }
                for stat in year_stats
            ]
        }
        
        return jsonify(stats), 200
        
    except Exception as e:
        current_app.logger.error(f"Error fetching academic records stats: {e}")
        return jsonify({"msg": "Failed to fetch statistics"}), 500
