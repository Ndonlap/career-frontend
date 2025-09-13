# blueprints/admin/models.py
# Admin role primarily interacts with other models (User, Course, Career, Assessment, SystemSettings)
# for management purposes. No dedicated 'Admin' model needed beyond the User model.
from blueprints.shared.models import Course, Career, Skill # Example imports
from blueprints.assessments.models import Assessment # Example import
from blueprints.public_content.models import PublicContent, SystemSettings # Example import