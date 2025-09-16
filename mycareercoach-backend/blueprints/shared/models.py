from extensions import mongo
from bson.objectid import ObjectId
from datetime import datetime
from datetime import date 

class AcademicRecord:
    collection_name = 'academic_records'

    def __init__(self, student_id, term, year, average_score, subjects, **kwargs):
        self.student_id = student_id
        self.term = term
        self.year = year
        self.average_score = average_score
        self.subjects = subjects
        self.uploaded_report_card = kwargs.get('uploaded_report_card', None)
        self.validation_status = kwargs.get('validation_status', 'pending')  # pending, validated, rejected
        self.validation_notes = kwargs.get('validation_notes', '')
        self.validated_by = kwargs.get('validated_by', None)
        self.validated_at = kwargs.get('validated_at', None)
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        self.updated_at = kwargs.get('updated_at', datetime.utcnow())
        self._id = kwargs.get('_id', None)

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['student_id'] = ObjectId(doc['student_id'])
        if self._id:
            result = mongo.db[self.collection_name].update_one(
                {"_id": ObjectId(self._id)},
                {"$set": doc}
            )
            return result.modified_count > 0
        else:
            result = mongo.db[self.collection_name].insert_one(doc)
            self._id = result.inserted_id
            return self._id

    @classmethod
    def find_by_student_id(cls, student_id):
        records_data = mongo.db[cls.collection_name].find({"student_id": ObjectId(student_id)})
        records = []
        for r in records_data:
            record_data = r.copy()
            student_id_str = str(record_data.pop('student_id'))
            if 'validated_by' in record_data and record_data['validated_by']:
                record_data['validated_by'] = str(record_data['validated_by'])
            records.append(cls(student_id=student_id_str, **record_data))
        return records
    
    @classmethod
    def find_by_id(cls, record_id):
        record_data = mongo.db[cls.collection_name].find_one({"_id": ObjectId(record_id)})
        if record_data:
            record_data = record_data.copy()
            student_id_str = str(record_data.pop('student_id'))
            if 'validated_by' in record_data and record_data['validated_by']:
                record_data['validated_by'] = str(record_data['validated_by'])
            return cls(student_id=student_id_str, **record_data)
        return None
    
    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        if self._id:
            doc['id'] = str(self._id)
        doc['student_id'] = str(self.student_id)
        if self.validated_by:
            doc['validated_by'] = str(self.validated_by)
        doc['created_at'] = self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at
        doc['updated_at'] = self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at
        if self.validated_at:
            doc['validated_at'] = self.validated_at.isoformat() if isinstance(self.validated_at, datetime) else self.validated_at
        return doc
    

class Course:
    collection_name = 'courses'

    def __init__(self, title, description, category, instructor, duration, **kwargs):
        self.title = title
        self.description = description
        self.category = category
        self.instructor = instructor
        self.duration = duration
        self.prerequisites = kwargs.get('prerequisites', [])
        self.skills_gained = kwargs.get('skills_gained', [])
        self.related_careers = kwargs.get('related_careers', []) # List of ObjectId strings
        self.students_enrolled_count = kwargs.get('students_enrolled_count', 0)
        self.average_rating = kwargs.get('average_rating', 0.0)
        self.status = kwargs.get('status', 'active')
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['related_careers'] = [ObjectId(cid) for cid in doc['related_careers']] # Convert to ObjectId
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def find_all(cls):
        courses_data = mongo.db[cls.collection_name].find({})
        return [cls(**c) for c in courses_data]

    @classmethod
    def find_by_id(cls, course_id):
        course_data = mongo.db[cls.collection_name].find_one({"_id": ObjectId(course_id)})
        if course_data:
            return cls(**course_data)
        return None

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['related_careers'] = [str(cid) for cid in doc['related_careers']]
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc


class Career:
    collection_name = 'careers'

    def __init__(self, title, description, industry, market_demand, growth_rate, avg_salary, **kwargs):
        self.title = title
        self.description = description
        self.industry = industry
        self.market_demand = market_demand
        self.growth_rate = growth_rate
        self.average_salary = avg_salary
        self.job_openings_estimate = kwargs.get('job_openings_estimate', 'Medium')
        self.required_skills = kwargs.get('required_skills', []) # List of ObjectId strings
        self.educational_paths = kwargs.get('educational_paths', []) # List of ObjectId strings
        self.industry_partners = kwargs.get('industry_partners', [])
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['required_skills'] = [ObjectId(sid) for sid in doc['required_skills']]
        doc['educational_paths'] = [ObjectId(cid) for cid in doc['educational_paths']]
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def find_all(cls):
        careers_data = mongo.db[cls.collection_name].find({})
        return [cls(**c) for c in careers_data]

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['required_skills'] = [str(sid) for sid in doc['required_skills']]
        doc['educational_paths'] = [str(cid) for cid in doc['educational_paths']]
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc


class Skill:
    collection_name = 'skills'

    def __init__(self, name, description, category, **kwargs):
        self.name = name
        self.description = description
        self.category = category
        self.related_courses = kwargs.get('related_courses', []) # List of ObjectId strings
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['related_courses'] = [ObjectId(cid) for cid in doc['related_courses']]
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['related_courses'] = [str(cid) for cid in doc['related_courses']]
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc

class Appointment:
    collection_name = 'appointments'

    def __init__(self, student_id, counselor_id, date, time, duration_minutes, type, notes_by_student, **kwargs):
        self.student_id = student_id
        self.counselor_id = counselor_id
        self.date = date  # This can be date object or string
        self.time = time
        self.duration_minutes = duration_minutes
        self.type = type
        self.notes_by_student = notes_by_student
        self.notes_by_counselor = kwargs.get('notes_by_counselor', '')
        self.status = kwargs.get('status', 'pending')
        self.priority = kwargs.get('priority', 'medium')
        self.session_feedback = kwargs.get('session_feedback', None)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['student_id'] = ObjectId(doc['student_id'])
        doc['counselor_id'] = ObjectId(doc['counselor_id'])
        
        # Convert date to ISO string for MongoDB storage
        if isinstance(doc.get('date'), date):
            doc['date'] = doc['date'].isoformat()
        elif isinstance(doc.get('date'), datetime):
            doc['date'] = doc['date'].date().isoformat()
        
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['student_id'] = str(doc['student_id'])
        doc['counselor_id'] = str(doc['counselor_id'])
        
        # Convert all date/datetime objects to ISO strings for JSON serialization
        if isinstance(doc.get('date'), date):
            doc['date'] = doc['date'].isoformat()
        elif isinstance(doc.get('date'), datetime):
            doc['date'] = doc['date'].date().isoformat()
        
        if isinstance(doc.get('created_at'), datetime):
            doc['created_at'] = doc['created_at'].isoformat()
        
        if isinstance(doc.get('updated_at'), datetime):
            doc['updated_at'] = doc['updated_at'].isoformat()
        
        return doc
    
class Recommendation:
    collection_name = 'recommendations'

    def __init__(self, student_id, type, match_score, summary, **kwargs):
        self.student_id = student_id
        self.type = type
        self.match_score = match_score
        self.summary = summary
        self.counselor_id = kwargs.get('counselor_id', None)
        self.status = kwargs.get('status', 'Generated')
        self.generated_by = kwargs.get('generated_by', 'AI')
        self.recommended_courses = kwargs.get('recommended_courses', []) # List of dicts or ObjectId strings
        self.suggested_skills = kwargs.get('suggested_skills', []) # List of dicts or ObjectId strings
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['student_id'] = ObjectId(doc['student_id'])
        if doc['counselor_id']:
            doc['counselor_id'] = ObjectId(doc['counselor_id'])
        
        # If recommended_courses/suggested_skills store just IDs, convert them
        # For now, let's assume they might be embedded dicts
        # doc['recommended_courses'] = [ObjectId(cid) for cid in doc['recommended_courses']] # if storing only IDs
        # doc['suggested_skills'] = [ObjectId(sid) for sid in doc['suggested_skills']] # if storing only IDs
        
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['student_id'] = str(doc['student_id'])
        if doc['counselor_id']:
            doc['counselor_id'] = str(doc['counselor_id'])
        # Convert any embedded ObjectIds if they are stored that way
        # Example: if recommended_courses stores [{"_id": ObjectId(), "name": "Course Title"}]
        # doc['recommended_courses'] = [{k: str(v) if k == '_id' else v for k, v in c.items()} for c in doc['recommended_courses']]
        # doc['suggested_skills'] = [{k: str(v) if k == '_id' else v for k, v in s.items()} for s in doc['suggested_skills']]
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        return doc