# blueprints/files/routes.py
from flask import jsonify, request, current_app
from blueprints.files import files_bp
from extensions import jwt, mongo
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os

@files_bp.route('/upload/<user_id>', methods=['POST'])
@jwt_required() # Assuming some level of authentication is needed, perhaps admin or self-upload
def upload_general_file(user_id):
    # This example allows a user to upload for themselves, or an admin for any user.
    # More granular authorization can be added (e.g., only admin, or user_id must match current_user_id)
    
    current_user_identity = get_jwt_identity()
    requester_id = current_user_identity['id']
    requester_role = current_user_identity['role']

    # Authorization: Either the user is an admin, or they are uploading for themselves
    if requester_role != 'admin' and requester_id != user_id:
        return jsonify({"msg": "Access denied: Cannot upload files for other users"}), 403

    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file:
        filename = secure_filename(file.filename)
        # Create a user-specific folder
        user_upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], user_id)
        if not os.path.exists(user_upload_folder):
            os.makedirs(user_upload_folder)
        
        file_path = os.path.join(user_upload_folder, filename)
        file.save(file_path)

        # Optional: Store file metadata in a dedicated collection or user document
        # e.g., mongo.db.users.update_one({"_id": ObjectId(user_id)}, {"$push": {"documents": {"filename": filename, "path": file_path, "upload_date": datetime.utcnow(), "type": "NIC"}}})

        return jsonify({"msg": "File uploaded successfully", "filename": filename, "file_path": file_path}), 201
    
    return jsonify({"msg": "File upload failed"}), 500