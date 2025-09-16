from extensions import mongo
from bson.objectid import ObjectId
from datetime import datetime
import random

class AssessmentQuestion:
    # We might embed questions directly into an Assessment, but this class is useful for defining the structure
    # and potentially managing a pool of questions if they are reused across different assessments.
    # For simplicity, we'll assume questions are embedded in an Assessment document for now,
    # but this class serves as a conceptual model for a single question's structure.
    def __init__(self, text, options, correct_answer=None, category=None, difficulty='medium', points=1, explanation=None, **kwargs):
        self.text = text
        self.options = options # List of strings
        self.correct_answer = correct_answer # String (for scored tests)
        self.category = category # e.g., "Logical Reasoning", "Career Values"
        self.difficulty = difficulty # easy, medium, hard
        self.points = points
        self.explanation = explanation
        print(" kwargs in init", kwargs)
        self._id = kwargs.get('_id', None)

    def to_dict(self):
        return {
            "id": str(self._id),
            "text": self.text,
            "options": self.options,
            "correct_answer": self.correct_answer, # Be careful not to expose this in API to students
            "category": self.category,
            "difficulty": self.difficulty,
            "points": self.points,
            "explanation": self.explanation
        }

class Assessment:
    collection_name = 'assessments'

    def __init__(self, name, description, type, duration_minutes, number_of_questions, created_by, questions, **kwargs):
        self.name = name
        self.description = description
        self.type = type # "aptitude", "interest", "personality", "quiz"
        self.duration_minutes = duration_minutes
        self.number_of_questions = number_of_questions
        self.created_by = created_by # ObjectId of admin user
        self.questions = [q.to_dict() if isinstance(q, AssessmentQuestion) else q for q in questions] # Store as dicts
        self.status = kwargs.get('status', 'published') # draft, published, archived
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['created_by'] = ObjectId(doc['created_by'])
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def get_random_questions(cls, assessment_id, num_questions):
        assessment_data = mongo.db[cls.collection_name].find_one(
            {"_id": ObjectId(assessment_id), "status": "published"},
            {"questions": 1}
        )
        if assessment_data and 'questions' in assessment_data:
            available_questions = assessment_data['questions']
            if num_questions > len(available_questions):
                num_questions = len(available_questions) # Return all if requested more than available
            
            # Select random questions
            random_questions = random.sample(available_questions, num_questions)
            
            # Remove correct_answer and explanation for student-facing API
            for q in random_questions:
                q.pop('correct_answer', None)
                q.pop('explanation', None)
                q['id'] = str(q['_id']) # Convert ObjectId
                q.pop('_id') # Remove raw ObjectId from output
            return random_questions
        return []

    def to_dict(self, include_solutions=False):
        doc = {k: v for k, v in self.__dict__.items()}
        print("doc")
        # doc['id'] = str(doc('_id'))
        doc['created_by'] = str(doc['created_by'])
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        print(doc)
        
        # Process questions for output
        processed_questions = []
        for q in doc['questions']:
            q_copy = q.copy()
            # q_copy['id'] = str(q_copy['_id'])
            # q_copy.pop('_id')
            if not include_solutions:
                q_copy.pop('correct_answer', None)
                q_copy.pop('explanation', None)
            processed_questions.append(q_copy)
        doc['questions'] = processed_questions
        return doc


class AssessmentResult:
    collection_name = 'assessment_results'

    def __init__(self, student_id, assessment_id, submission_date, answers, **kwargs):
        self.student_id = student_id
        self.assessment_id = assessment_id
        self.submission_date = submission_date
        self.answers = answers # List of dicts: {"question_id": "...", "student_answer": "...", "is_correct": True}
        self.score = kwargs.get('score', 0)
        self.total_points_possible = kwargs.get('total_points_possible', 0)
        self.insights = kwargs.get('insights', {}) # e.g., {"strengths": [], "weaknesses": []}
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self._id = None

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['student_id'] = ObjectId(doc['student_id'])
        doc['assessment_id'] = ObjectId(doc['assessment_id'])
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    def to_dict(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['id'] = str(doc.pop('_id')) if '_id' in doc else None
        doc['student_id'] = str(doc['student_id'])
        doc['assessment_id'] = str(doc['assessment_id'])
        doc['submission_date'] = doc['submission_date'].isoformat()
        doc['created_at'] = doc['created_at'].isoformat()
        doc['updated_at'] = doc['updated_at'].isoformat()
        # Convert any embedded ObjectIds within answers if necessary
        return doc