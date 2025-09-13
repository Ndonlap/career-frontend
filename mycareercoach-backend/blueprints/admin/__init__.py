from flask import Blueprint

admin_bp = Blueprint('admin', __name__)

from . import routes # Import routes to associate them with the blueprint