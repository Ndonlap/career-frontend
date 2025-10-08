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
        self._ensure_question_ids()
    
    def _ensure_question_ids(self):
        """Ensure each question has an _id field"""
        for i, question in enumerate(self.questions):
            if '_id' not in question:
                question['_id'] = ObjectId()

    def save(self):
        self._ensure_question_ids()
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
                q['_id'] = str(q['_id']) # Convert ObjectId
                # q.pop('_id',None) # Remove raw ObjectId from output
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
        self._id =  kwargs.get('_id', None)

    def save(self):
        doc = {k: v for k, v in self.__dict__.items() if k != '_id'}
        doc['student_id'] = ObjectId(doc['student_id'])
        doc['assessment_id'] = ObjectId(doc['assessment_id'])
        result = mongo.db[self.collection_name].insert_one(doc)
        self._id = result.inserted_id
        return self._id

    @classmethod
    def find_by_student_id(cls, student_id, include_assessment_details=True):
        """Find all assessment results for a student"""
        try:
            # Base query to get assessment results
            results_cursor = mongo.db.assessment_results.find(
                {"student_id": ObjectId(student_id)}
            ).sort("submission_date", -1)
            
            results_list = []
            for res_data in results_cursor:
                # Prepare kwargs for constructor
                kwargs = res_data.copy()
                
                # Remove fields that will be passed as explicit parameters
                fields_to_remove = ["student_id", "assessment_id", "submission_date", "answers"]
                for field in fields_to_remove:
                    kwargs.pop(field, None)
                
                # Create AssessmentResult instance
                res_obj = cls(
                    student_id=str(res_data['student_id']),
                    assessment_id=str(res_data['assessment_id']),
                    submission_date=res_data['submission_date'],
                    answers=res_data.get('answers', []),
                    **kwargs
                )
                
                # Set the _id
                res_obj._id = res_data['_id']
                
                # Fetch and include assessment details if requested
                if include_assessment_details:
                    assessment = mongo.db.assessments.find_one(
                        {"_id": ObjectId(res_data['assessment_id'])}
                    )
                    if assessment:
                        res_obj.assessment_details = {
                            'name': assessment.get('name', 'Unknown Assessment'),
                            'description': assessment.get('description', ''),
                            'type': assessment.get('type', 'unknown'),
                            'duration_minutes': assessment.get('duration_minutes', 0),
                            'number_of_questions': assessment.get('number_of_questions', 0)
                        }
                
                results_list.append(res_obj)
            
            print(f"Found {len(results_list)} assessment results for student {student_id}")
            return results_list
            
        except Exception as e:
            print(f"Error finding assessment results for student {student_id}: {e}")
            return []


    @classmethod
    def find_by_student_and_assessment(cls, student_id, assessment_id):
        """Find a specific assessment result for a student"""
        try:
            res_data = mongo.db.assessment_results.find_one({
                "student_id": ObjectId(student_id),
                "assessment_id": ObjectId(assessment_id)
            })
            
            if not res_data:
                return None
            
            # Prepare kwargs for constructor
            kwargs = res_data.copy()
            fields_to_remove = ["student_id", "assessment_id", "submission_date", "answers"]
            for field in fields_to_remove:
                kwargs.pop(field, None)
            
            # Create AssessmentResult instance
            res_obj = cls(
                student_id=str(res_data['student_id']),
                assessment_id=str(res_data['assessment_id']),
                submission_date=res_data['submission_date'],
                answers=res_data.get('answers', []),
                **kwargs
            )
            
            # Set the _id
            res_obj._id = res_data['_id']
            
            return res_obj
            
        except Exception as e:
            print(f"Error finding assessment result: {e}")
            return None

    @classmethod
    def get_recent_results(cls, student_id, limit=5):
        """Get most recent assessment results for a student"""
        try:
            results_cursor = mongo.db.assessment_results.find({
                "student_id": ObjectId(student_id)
            }).sort("submission_date", -1).limit(limit)
            
            results_list = []
            for res_data in results_cursor:
                # Prepare kwargs for constructor
                kwargs = res_data.copy()
                fields_to_remove = ["student_id", "assessment_id", "submission_date", "answers"]
                for field in fields_to_remove:
                    kwargs.pop(field, None)
                
                # Create AssessmentResult instance
                res_obj = cls(
                    student_id=str(res_data['student_id']),
                    assessment_id=str(res_data['assessment_id']),
                    submission_date=res_data['submission_date'],
                    answers=res_data.get('answers', []),
                    **kwargs
                )
                
                # Set the _id
                res_obj._id = res_data['_id']
                results_list.append(res_obj)
            
            return results_list
            
        except Exception as e:
            print(f"Error getting recent assessment results: {e}")
            return []


    @classmethod
    def get_recent_results(cls, student_id, limit=5):
        """Get most recent assessment results for a student"""
        try:
            results = mongo.db[cls.collection_name].find({
                "student_id": ObjectId(student_id)
            }).sort("submission_date", -1).limit(limit)
            
            return [cls(
                student_id=result['student_id'],
                assessment_id=result['assessment_id'],
                submission_date=result['submission_date'],
                answers=result.get('answers', []),
                score=result.get('score', 0),
                total_points_possible=result.get('total_points_possible', 0),
                insights=result.get('insights', {}),
                _id=result.get('_id')
            ) for result in results]
            
        except Exception as e:
            print(f"Error getting recent assessment results: {e}")
            return []

    def to_dict(self, include_assessment_details=False):
        """Convert to dictionary with optional assessment details"""
        doc = {k: v for k, v in self.__dict__.items() if not k.startswith('_') and k != 'assessment_details'}
        
        # Convert ObjectIds to strings
        if hasattr(self, '_id') and self._id:
            doc['id'] = str(self._id)
            doc['_id'] = str(self._id)
        
        doc['student_id'] = str(self.student_id)
        doc['assessment_id'] = str(self.assessment_id)
        doc['submission_date'] = self.submission_date.isoformat() if hasattr(self.submission_date, 'isoformat') else self.submission_date
        doc['created_at'] = self.created_at.isoformat() if hasattr(self.created_at, 'isoformat') else self.created_at
        doc['updated_at'] = self.updated_at.isoformat() if hasattr(self.updated_at, 'isoformat') else self.updated_at
        
        # Include assessment details if available and requested
        if include_assessment_details and hasattr(self, 'assessment_details'):
            doc['assessment_details'] = self.assessment_details
        
        return doc

    @classmethod
    def get_assessment_statistics(cls, student_id):
        """Get statistics about student's assessment performance"""
        try:
            pipeline = [
                {
                    "$match": {
                        "student_id": ObjectId(student_id)
                    }
                },
                {
                    "$lookup": {
                        "from": "assessments",
                        "localField": "assessment_id",
                        "foreignField": "_id",
                        "as": "assessment_details"
                    }
                },
                {
                    "$unwind": "$assessment_details"
                },
                {
                    "$group": {
                        "_id": "$assessment_details.type",
                        "average_score": {"$avg": "$score"},
                        "total_assessments": {"$sum": 1},
                        "total_points": {"$sum": "$total_points_possible"},
                        "recent_submission": {"$max": "$submission_date"}
                    }
                }
            ]
            
            return list(mongo.db[cls.collection_name].aggregate(pipeline))
            
        except Exception as e:
            print(f"Error getting assessment statistics: {e}")
            return []



            # mongorestore --uri="mongodb://localhost:27017" database