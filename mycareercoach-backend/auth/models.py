from extensions import mongo # Import the mongo instance from extensions
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
from datetime import datetime

class User:
    collection_name = 'users'

    def __init__(self, email, password, role, first_name, last_name, **kwargs):
        self.email = email
        self.password_hash = generate_password_hash(password)
        self.role = role # "student", "counselor", "admin"
        self.first_name = first_name
        self.last_name = last_name
        self.join_date = datetime.utcnow()
        self.last_login_at = datetime.utcnow()
        self.status = "active" # active, inactive, suspended
        self.avatar_initials = (first_name[0] + last_name[0]).upper() if first_name and last_name else ""

        # Specific fields for student role
        if self.role == "student":
            self.school = kwargs.get('school', '')
            self.grade = kwargs.get('grade', '')
            self.gpa = kwargs.get('gpa', 0.0)
            self.class_rank = kwargs.get('class_rank', 0)
            self.total_students_in_class = kwargs.get('total_students_in_class', 0)
            self.credits_completed = kwargs.get('credits_completed', 0)
            self.total_credits_required = kwargs.get('total_credits_required', 0)
            self.average_grade = kwargs.get('average_grade', 0.0)
            self.interests = kwargs.get('interests', {}) # e.g., {"problem_solving": 5, "creativity": 7}
            self.assigned_counselor_id = kwargs.get('assigned_counselor_id', None)
            self.risk_level = kwargs.get('risk_level', 'Low') # Low, Medium, High

        # Specific fields for counselor role
        elif self.role == "counselor":
            self.specialization = kwargs.get('specialization', [])
            self.rating = kwargs.get('rating', 0.0)
            self.bio = kwargs.get('bio', '')
            self.contact_phone = kwargs.get('contact_phone', '')
            self.contact_email = kwargs.get('contact_email', email)
            self.availability = kwargs.get('availability', []) # List of dicts: [{"day": "Monday", "start": "09:00", "end": "17:00"}]

        # No specific extra fields for admin for now, but can be added

    def save(self):
        # Converts the User object to a dictionary for MongoDB insertion
        user_data = {
            "email": self.email,
            "password_hash": self.password_hash,
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "join_date": self.join_date,
            "last_login_at": self.last_login_at,
            "status": self.status,
            "avatar_initials": self.avatar_initials,
        }

        if self.role == "student":
            user_data.update({
                "school": self.school,
                "grade": self.grade,
                "gpa": self.gpa,
                "class_rank": self.class_rank,
                "total_students_in_class": self.total_students_in_class,
                "credits_completed": self.credits_completed,
                "total_credits_required": self.total_credits_required,
                "average_grade": self.average_grade,
                "interests": self.interests,
                "assigned_counselor_id": self.assigned_counselor_id,
                "risk_level": self.risk_level,
            })
        elif self.role == "counselor":
            user_data.update({
                "specialization": self.specialization,
                "rating": self.rating,
                "bio": self.bio,
                "contact_phone": self.contact_phone,
                "contact_email": self.contact_email,
                "availability": self.availability,
            })

        # Insert the document into MongoDB
        result = mongo.db[self.collection_name].insert_one(user_data)
        self._id = result.inserted_id # Store the generated _id
        return self._id

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @classmethod
    def find_by_email(cls, email):
        print("cls",cls)
        user_data = mongo.db[cls.collection_name].find_one({"email": email})
        if user_data:
           # Create a copy of user_data without the fields that are already passed explicitly
            kwargs = user_data.copy()
            # Remove the fields that are passed as explicit parameters
            kwargs.pop('email', None)
            kwargs.pop('role', None)
            kwargs.pop('first_name', None)
            kwargs.pop('last_name', None)
            kwargs.pop('password_hash', None)  # We handle this separately
            kwargs.pop('_id', None)  # We handle this separately
            
            # Reconstruct a User object from MongoDB data
            user = cls(
                email=user_data['email'],
                password='dummy_password_no_hash_needed', # Placeholder, hash is already in DB
                role=user_data['role'],
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                **kwargs # Pass only the remaining fields as kwargs
            )
            user.password_hash = user_data['password_hash'] # Set the hash directly
            user._id = user_data['_id'] # Set the MongoDB _id
            return user
        return None

    @classmethod
    def find_by_id(cls, user_id):
        user_data = mongo.db[cls.collection_name].find_one({"_id": ObjectId(user_id)})
        if user_data:
            kwargs = user_data.copy()
            # Remove the fields that are passed as explicit parameters
            kwargs.pop('email', None)
            kwargs.pop('role', None)
            kwargs.pop('first_name', None)
            kwargs.pop('last_name', None)
            kwargs.pop('password_hash', None)  # We handle this separately
            kwargs.pop('_id', None)  # We handle this separately
            
            # Reconstruct a User object from MongoDB data
            user = cls(
                email=user_data['email'],
                password='dummy_password_no_hash_needed', # Placeholder, hash is already in DB
                role=user_data['role'],
                first_name=user_data.get('first_name'),
                last_name=user_data.get('last_name'),
                **kwargs # Pass only the remaining fields as kwargs
            )
            user.password_hash = user_data['password_hash'] # Set the hash directly
            user._id = user_data['_id'] # Set the MongoDB _id
            return user
        return None

    def to_dict(self, include_password=False):
        # Convert user object to a dictionary for API responses
        data = {
            "id": str(self._id), # Convert ObjectId to string for JSON
            "email": self.email,
            "role": self.role,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "join_date": self.join_date.isoformat() if self.join_date else None,
            "last_login_at": self.last_login_at.isoformat() if self.last_login_at else None,
            "status": self.status,
            "avatar_initials": self.avatar_initials,
        }
        if include_password:
            data["password_hash"] = self.password_hash # Should be used with extreme caution

        if self.role == "student":
            data.update({
                "school": self.school,
                "grade": self.grade,
                "gpa": self.gpa,
                "class_rank": self.class_rank,
                "total_students_in_class": self.total_students_in_class,
                "credits_completed": self.credits_completed,
                "total_credits_required": self.total_credits_required,
                "average_grade": self.average_grade,
                "interests": self.interests,
                "assigned_counselor_id": str(self.assigned_counselor_id) if self.assigned_counselor_id else None,
                "risk_level": self.risk_level,
            })
        elif self.role == "counselor":
            data.update({
                "specialization": self.specialization,
                "rating": self.rating,
                "bio": self.bio,
                "contact_phone": self.contact_phone,
                "contact_email": self.contact_email,
                "availability": self.availability,
            })
        
        return data
