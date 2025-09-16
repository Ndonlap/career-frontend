import os
import json
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime
import uuid
from extensions import jwt, mongo

# Create blueprint for content management
content_bp = Blueprint('content_management', __name__)

# Helper function to check admin role
def check_admin_role():
    current_user_identity_str = get_jwt_identity()
    current_user_identity = json.loads(current_user_identity_str)
    if current_user_identity.get('role') != 'admin':
        return jsonify({"msg": "Admin access required"}), 403
    return None

# File paths for JSON content
CONTENT_FILES = {
    'courses': 'courses_cameroon.json',
    'careers': 'careers_cameroon.json',
    'skills': 'skills_cameroon.json'
}

def get_content_directory():
    """Get the content directory path"""
    content_dir = os.path.join(current_app.root_path, 'content_data')
    if not os.path.exists(content_dir):
        os.makedirs(content_dir)
    return content_dir

def get_content_file_path(content_type):
    """Get the full path for a content file"""
    return os.path.join(get_content_directory(), CONTENT_FILES[content_type])

def load_content(content_type):
    """Load content from JSON file"""
    file_path = get_content_file_path(content_type)
    try:
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {content_type: []}
    except Exception as e:
        current_app.logger.error(f"Error loading {content_type}: {e}")
        return {content_type: []}

def save_content(content_type, data):
    """Save content to JSON file"""
    file_path = get_content_file_path(content_type)
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        current_app.logger.error(f"Error saving {content_type}: {e}")
        return False

@content_bp.route('/<content_type>', methods=['GET'])
@jwt_required()
def get_content(content_type):
    """Get content for a specific type (courses, careers, skills)"""
    error = check_admin_role()
    if error:
        return error
    
    if content_type not in CONTENT_FILES:
        return jsonify({"msg": "Invalid content type"}), 400
    
    content_data = load_content(content_type)
    return jsonify(content_data), 200

@content_bp.route('/<content_type>', methods=['PUT'])
@jwt_required()
def update_content(content_type):
    """Update content for a specific type"""
    error = check_admin_role()
    if error:
        return error
    
    if content_type not in CONTENT_FILES:
        return jsonify({"msg": "Invalid content type"}), 400
    
    data = request.get_json()
    if not data or content_type not in data:
        return jsonify({"msg": f"Invalid data format. Expected {{'{content_type}': [...]}}"}), 400
    
    if save_content(content_type, data):
        return jsonify({"msg": f"{content_type.capitalize()} content updated successfully"}), 200
    else:
        return jsonify({"msg": f"Failed to update {content_type} content"}), 500

@content_bp.route('/<content_type>/upload', methods=['POST'])
@jwt_required()
def upload_content_file(content_type):
    """Upload a new JSON file to replace existing content"""
    error = check_admin_role()
    if error:
        return error
    
    if content_type not in CONTENT_FILES:
        return jsonify({"msg": "Invalid content type"}), 400
    
    if 'file' not in request.files:
        return jsonify({"msg": "No file provided"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No file selected"}), 400
    
    if not file.filename.endswith('.json'):
        return jsonify({"msg": "Only JSON files are allowed"}), 400
    
    try:
        # Read and validate JSON content
        content_data = json.load(file.stream)
        if content_type not in content_data:
            return jsonify({"msg": f"Invalid JSON format. Expected {{'{content_type}': [...]}}"}), 400
        
        # Create backup of current file
        file_path = get_content_file_path(content_type)
        if os.path.exists(file_path):
            backup_path = f"{file_path}.backup.{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
            os.rename(file_path, backup_path)
        
        # Save new content
        if save_content(content_type, content_data):
            return jsonify({"msg": f"{content_type.capitalize()} content uploaded successfully"}), 200
        else:
            return jsonify({"msg": f"Failed to save {content_type} content"}), 500
            
    except json.JSONDecodeError:
        return jsonify({"msg": "Invalid JSON file"}), 400
    except Exception as e:
        current_app.logger.error(f"Error uploading {content_type} file: {e}")
        return jsonify({"msg": f"Error processing file: {str(e)}"}), 500

@content_bp.route('/<content_type>/sync-to-db', methods=['POST'])
@jwt_required()
def sync_content_to_db(content_type):
    """Sync JSON content to database"""
    error = check_admin_role()
    if error:
        return error
    
    if content_type not in ['courses', 'careers', 'skills']:
        return jsonify({"msg": "Invalid content type for sync"}), 400
    
    content_data = load_content(content_type)
    items = content_data.get(content_type, [])
    
    try:
        if content_type == 'courses':
            collection = mongo.db.courses
            for item in items:
                # Convert related_careers from strings to ObjectIds
                if 'related_careers' in item:
                    item['related_careers'] = [ObjectId(cid) for cid in item['related_careers'] if ObjectId.is_valid(cid)]
                item['updated_at'] = datetime.utcnow()
                if '_id' in item:
                    collection.update_one({'_id': ObjectId(item['_id'])}, {'$set': item})
                else:
                    item['created_at'] = datetime.utcnow()
                    collection.insert_one(item)
        
        elif content_type == 'careers':
            collection = mongo.db.careers
            for item in items:
                # Convert ObjectId fields
                for field in ['required_skills', 'educational_paths']:
                    if field in item:
                        item[field] = [ObjectId(oid) for oid in item[field] if ObjectId.is_valid(oid)]
                item['updated_at'] = datetime.utcnow()
                if '_id' in item:
                    collection.update_one({'_id': ObjectId(item['_id'])}, {'$set': item})
                else:
                    item['created_at'] = datetime.utcnow()
                    collection.insert_one(item)
        
        elif content_type == 'skills':
            collection = mongo.db.skills
            for item in items:
                if 'related_courses' in item:
                    item['related_courses'] = [ObjectId(cid) for cid in item['related_courses'] if ObjectId.is_valid(cid)]
                item['updated_at'] = datetime.utcnow()
                if '_id' in item:
                    collection.update_one({'_id': ObjectId(item['_id'])}, {'$set': item})
                else:
                    item['created_at'] = datetime.utcnow()
                    collection.insert_one(item)
        
        return jsonify({"msg": f"{content_type.capitalize()} synced to database successfully", "count": len(items)}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error syncing {content_type} to DB: {e}")
        return jsonify({"msg": f"Error syncing to database: {str(e)}"}), 500

@content_bp.route('/<content_type>/export', methods=['GET'])
@jwt_required()
def export_content(content_type):
    """Export content from database to JSON format"""
    error = check_admin_role()
    if error:
        return error
    
    if content_type not in ['courses', 'careers', 'skills']:
        return jsonify({"msg": "Invalid content type for export"}), 400
    
    try:
        if content_type == 'courses':
            items = list(mongo.db.courses.find({}))
            for item in items:
                item['_id'] = str(item['_id'])
                item['related_careers'] = [str(cid) for cid in item.get('related_careers', [])]
        
        elif content_type == 'careers':
            items = list(mongo.db.careers.find({}))
            for item in items:
                item['_id'] = str(item['_id'])
                for field in ['required_skills', 'educational_paths']:
                    item[field] = [str(oid) for oid in item.get(field, [])]
        
        elif content_type == 'skills':
            items = list(mongo.db.skills.find({}))
            for item in items:
                item['_id'] = str(item['_id'])
                item['related_courses'] = [str(cid) for cid in item.get('related_courses', [])]
        
        return jsonify({content_type: items}), 200
    
    except Exception as e:
        current_app.logger.error(f"Error exporting {content_type}: {e}")
        return jsonify({"msg": f"Error exporting {content_type}: {str(e)}"}), 500