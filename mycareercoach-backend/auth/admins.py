from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from bson.objectid import ObjectId
from datetime import datetime
from extensions import mongo
from auth import auth_bp
from auth.models import User # Import the User model

@auth_bp.route('/admin/users', methods=['POST'])
def create_user():
    """Create a new user (admin, student, counselor)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'password', 'role', 'first_name', 'last_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if user already exists
        if User.find_by_email(data['email']):
            return jsonify({'error': 'User with this email already exists'}), 409
        
        # Validate role
        valid_roles = ['student', 'counselor', 'admin']
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        
        # Role-specific validation
        if data['role'] == 'student':
            # Validate student-specific fields if provided
            student_fields = ['school', 'grade', 'gpa', 'class_rank', 
                             'total_students_in_class', 'credits_completed',
                             'total_credits_required', 'average_grade']
            student_data = {field: data.get(field) for field in student_fields if field in data}
            
            # Create student user
            user = User(
                email=data['email'],
                password=data['password'],
                role=data['role'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                **student_data
            )
            
        elif data['role'] == 'counselor':
            # Validate counselor-specific fields if provided
            counselor_fields = ['specialization', 'rating', 'bio', 
                               'contact_phone', 'availability']
            counselor_data = {field: data.get(field) for field in counselor_fields if field in data}
            
            # Use provided contact_email or default to email
            if 'contact_email' in data:
                counselor_data['contact_email'] = data['contact_email']
            
            # Create counselor user
            user = User(
                email=data['email'],
                password=data['password'],
                role=data['role'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                **counselor_data
            )
            
        else:  # admin
            # Create admin user
            user = User(
                email=data['email'],
                password=data['password'],
                role=data['role'],
                first_name=data['first_name'],
                last_name=data['last_name']
            )
        
        # Save user to database
        user_id = user.save()
        
        return jsonify({
            'message': 'User created successfully',
            'user_id': str(user_id)
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>/role', methods=['PUT'])
def update_user_role(user_id):
    """Update a user's role"""
    try:
        data = request.get_json()
        
        if 'role' not in data:
            return jsonify({'error': 'Missing role field'}), 400
        
        # Validate role
        valid_roles = ['student', 'counselor', 'admin']
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update role
        result = mongo.db[User.collection_name].update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'role': data['role']}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to update role'}), 500
        
        return jsonify({'message': 'User role updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>/suspend', methods=['PUT'])
def suspend_user(user_id):
    """Suspend a user account"""
    try:
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update status to suspended
        result = mongo.db[User.collection_name].update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'status': 'suspended'}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to suspend user'}), 500
        
        return jsonify({'message': 'User suspended successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>/reactivate', methods=['PUT'])
def reactivate_user(user_id):
    """Reactivate a user account"""
    try:
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Update status to active
        result = mongo.db[User.collection_name].update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'status': 'active'}}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to reactivate user'}), 500
        
        return jsonify({'message': 'User reactivated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>', methods=['DELETE'])
def delete_user(user_id):
    """Delete a user account"""
    try:
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Delete user from database
        result = mongo.db[User.collection_name].delete_one({'_id': ObjectId(user_id)})
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Failed to delete user'}), 500
        
        return jsonify({'message': 'User deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user details"""
    try:
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify(user.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users', methods=['GET'])
def get_all_users():
    """Get all users with optional filtering"""
    try:
        role = request.args.get('role')
        status = request.args.get('status')
        
        # Build query
        query = {}
        if role:
            query['role'] = role
        if status:
            query['status'] = status
        
        # Get users from database
        users_data = mongo.db[User.collection_name].find(query)
        
        # Convert to list of dictionaries
        users = []
        for user_data in users_data:
            user = User.find_by_id(str(user_data['_id']))
            if user:
                users.append(user.to_dict())
        
        return jsonify(users), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/admin/users/<user_id>', methods=['PUT'])
def update_user(user_id):
    """Update user information"""
    try:
        data = request.get_json()
        
        # Find user
        user = User.find_by_id(user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Remove fields that shouldn't be updated directly
        data.pop('_id', None)
        data.pop('password_hash', None)
        data.pop('join_date', None)
        
        # Handle password update separately
        if 'password' in data:
            data['password_hash'] = generate_password_hash(data['password'])
            data.pop('password')
        
        # Update user in database
        result = mongo.db[User.collection_name].update_one(
            {'_id': ObjectId(user_id)},
            {'$set': data}
        )
        
        if result.modified_count == 0:
            return jsonify({'error': 'Failed to update user'}), 500
        
        return jsonify({'message': 'User updated successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500