from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

from . import routes # Import routes to associate them with the blueprint