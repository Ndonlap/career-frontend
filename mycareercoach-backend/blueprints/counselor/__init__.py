from flask import Blueprint

counselor_bp = Blueprint('counselor', __name__)

from . import routes # Import routes to associate them with the blueprint