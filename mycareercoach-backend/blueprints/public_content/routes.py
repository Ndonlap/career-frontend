from flask import jsonify, request
from blueprints.public_content import public_content_bp
from blueprints.public_content.models import PublicContent, SystemSettings # Import models
from extensions import mongo
from bson.objectid import ObjectId
from datetime import datetime

# --- Public Routes for Informational Content ---

@public_content_bp.route('/services', methods=['GET'])
def get_public_services():
    """
    Retrieves a list of all published services for the homepage.
    """
    services = PublicContent.find_all_published_by_type("service_item")
    return jsonify([service.to_dict() for service in services]), 200

@public_content_bp.route('/resources', methods=['GET'])
def get_public_resources():
    """
    Retrieves a list of all published resources (news, articles) for the resources page.
    Optionally, filter for featured resource.
    """
    is_featured = request.args.get('featured', 'false').lower() == 'true'
    
    query = {"type": "resource_article", "status": "published"}
    if is_featured:
        query["is_featured"] = True

    resources_cursor = mongo.db.public_content.find(query).sort("published_at", -1)
    
    resources_list = []
    for res_data in resources_cursor:
        res = PublicContent(**res_data)
        resources_list.append(res.to_dict())
    
    # Frontend logic expects a single featured and then other list.
    # We'll adapt it to send just a list, and frontend takes the first as featured.
    # Or, you can have a separate endpoint /resources/featured
    
    return jsonify(resources_list), 200

@public_content_bp.route('/resources/<resource_id>', methods=['GET'])
def get_single_public_resource(resource_id):
    """
    Retrieves details for a single published resource.
    """
    resource_data = mongo.db.public_content.find_one(
        {"_id": ObjectId(resource_id), "type": "resource_article", "status": "published"}
    )
    if not resource_data:
        return jsonify({"msg": "Resource not found or not published"}), 404
    
    resource = PublicContent(**resource_data)
    return jsonify(resource.to_dict()), 200


@public_content_bp.route('/faqs', methods=['GET'])
def get_public_faqs():
    """
    Retrieves a list of all published FAQ items.
    """
    faqs = PublicContent.find_all_published_by_type("faq_item")
    return jsonify([faq.to_dict() for faq in faqs]), 200

@public_content_bp.route('/homepage_hero', methods=['GET'])
def get_homepage_hero_content():
    """
    Retrieves content for the homepage hero section.
    """
    hero_content = PublicContent.find_one_by_type("homepage_hero")
    if not hero_content:
        # If no hero content is found, return a default/placeholder
        return jsonify({
            "title": "Turning Academic Decisions into Career Success.",
            "description": "From selecting the right course to achieving your goals, our platform supports you at every step of your journey.",
            "image_url": "/static/images/default_hommmm.png" # Provide a default image path
        }), 200
        
    return jsonify(hero_content.to_dict()), 200

@public_content_bp.route('/system_info', methods=['GET'])
def get_system_public_info():
    """
    Retrieves public-facing system information, like platform name.
    """
    settings = SystemSettings.get_settings()
    if not settings:
        # If settings aren't initialized, return minimal defaults
        return jsonify({"platform_name": "MyCareerCoach", "contact_phone": "657364499"}), 200
    
    return jsonify({
        "platform_name": settings.platform_name,
        "contact_phone": "657364499" # Hardcoded for now as it's in frontend. Could be in settings.
    }), 200

# --- Admin Content Management Routes (already covered in admin blueprint, but listing relevant types for clarity) ---
# These routes would live in the admin blueprint, but use the PublicContent model
# @admin_bp.route('/content', methods=['POST'])
# @jwt_required()
# def create_content_item():
#     # Logic to create 'service_item', 'resource_article', 'faq_item', 'homepage_hero'
#     pass

# @admin_bp.route('/content/<id>', methods=['PUT'])
# @jwt_required()
# def update_content_item():
#     # Logic to update any content item
#     pass

# @admin_bp.route('/content/<id>', methods=['DELETE'])
# @jwt_required()
# def delete_content_item():
#     # Logic to delete any content item
#     pass