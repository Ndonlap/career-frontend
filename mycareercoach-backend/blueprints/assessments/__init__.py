from flask import Blueprint

assessments_bp = Blueprint('assessments', __name__)

from . import routes # We'll create this next for assessments
from . import models # Ensure models are importable