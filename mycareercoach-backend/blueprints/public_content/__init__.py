from flask import Blueprint

public_content_bp = Blueprint('public_content', __name__)

from . import routes # Import routes to associate them with the blueprint