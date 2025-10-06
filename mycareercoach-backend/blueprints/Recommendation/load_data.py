import json
import time
from datetime import datetime
from bson.objectid import ObjectId

class RecommendationSimulator:
    def __init__(self):
        self.careers_data = self.load_static_data('careers')
        self.skills_data = self.load_static_data('skills') 
        self.courses_data = self.load_static_data('courses')
    
    def load_static_data(self, data_type):
        """Load static JSON data from files"""
        try:
            with open(f'static/{data_type}_data.json', 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            # Fallback to your provided sample data structure
            return self.get_sample_data(data_type)
    
    def get_sample_data(self, data_type):
        """Provide sample data based on your structure"""
#         if data_type == 'skills':
#     return [{
#         "name": "Analyse biologique",
#         "description": "Techniques de laboratoire pour l’étude des cellules, tissus et micro-organismes",
#         "category": "Biologie",
#         "related_courses": ["Biologie et Sciences de la Vie"]
#     }]
# elif data_type == 'courses':
#     return [{
#         "title": "Biologie et Sciences de la Vie",
#         "description": "Cours couvrant les principes fondamentaux de la biologie, la microbiologie, la génétique, et l'analyse cellulaire",
#         "category": "Biologie",
#         "instructor": "Dr. Amina Tchoumbou",
#         "duration": "6 mois",
#         "prerequisites": ["Baccalauréat scientifique"],
#         "skills_gained": ["Techniques de culture cellulaire", "Analyse microbiologique", "Observation microscopique", "Identification de micro-organismes"],
#         "related_careers": ["Biologiste", "Technicien de laboratoire", "Chercheur en biologie"],
#         "students_enrolled_count": 250,
#         "average_rating": 4.7,
#         "status": "active"
#     }]
# elif data_type == 'careers':
#     return [{
#         "title": "Biologiste",
#         "description": "Professionnel spécialisé dans l’étude des organismes vivants, des cellules et des micro-organismes",
#         "industry": "Biologie et Santé",
#         "market_demand": "Élevée",
#         "growth_rate": 12,
#         "average_salary": 1500000,
#         "job_openings_estimate": "High",
#         "required_skills": ["Analyse biologique", "Techniques de laboratoire", "Observation microscopique", "Manipulation de cultures cellulaires"],
#         "educational_paths": ["Licence en Biologie", "Master en Biologie", "Doctorat en Sciences de la Vie"],
#         "industry_partners": ["Institut Pasteur", "IRD", "CNRS", "Université de Yaoundé I"]
#     }]
