from flask import jsonify, request
from auth import auth_bp
from auth.models import User # Import the User model
from extensions import jwt # Import JWTManager instance
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from datetime import datetime
from extensions import mongo 
import json
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'student') # Default to student
    first_name = data.get('first_name')
    last_name = data.get('last_name')

    if not email or not password or not first_name or not last_name:
        return jsonify({"msg": "Missing email, password, first name, or last name"}), 400

    if User.find_by_email(email):
        return jsonify({"msg": "User with that email already exists"}), 409

    try:
        # Create a new User instance and save it
        new_user = User(
            email=email,
            password=password,
            role=role,
            first_name=first_name,
            last_name=last_name,
            # Pass any role-specific kwargs here if registration allows them
            school=data.get('school') if role == 'student' else None,
            specialization=data.get('specialization') if role == 'counselor' else None
        )
        user_id = new_user.save()
        
        return jsonify({"msg": "User registered successfully", "user_id": str(user_id)}), 201
    except Exception as e:
        return jsonify({"msg": f"Error registering user: {str(e)}"}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({"msg": "Missing email or password"}), 400

    user = User.find_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"msg": "Bad username or password"}), 401

    # Update last_login_at
    print("user")
    print(user)
    mongo.db.users.update_one(
        {"_id": user._id},
        {"$set": {"last_login_at": datetime.utcnow()}}
    )
    # Convert identity to JSON string
    identity_data = {'id': str(user._id), 'role': user.role}
    identity_str = json.dumps(identity_data)  # Convert to string
    
    access_token = create_access_token(identity=identity_str)
    refresh_token = create_refresh_token(identity=identity_str)

    # access_token = create_access_token(identity={'id': str(user._id), 'role': user.role})
    # refresh_token = create_refresh_token(identity={'id': str(user._id), 'role': user.role})
    return jsonify(access_token=access_token, refresh_token=refresh_token, role=user.role), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True) # Requires a refresh token
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required() # Requires a valid access token
def get_current_user_profile():
    identity = get_jwt_identity()
    user_id = identity['id']
    
    user = User.find_by_id(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    return jsonify(user.to_dict()), 200

# Example protected route to test JWT
@auth_bp.route('/protected', methods=['GET'])
@jwt_required() # Requires a valid access token
def protected():
    current_user_identity = get_jwt_identity()
    return jsonify(logged_in_as=current_user_identity, message="You have access to protected data!"), 200