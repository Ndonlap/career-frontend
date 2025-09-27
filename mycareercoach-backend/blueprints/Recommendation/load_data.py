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
        if data_type == 'skills':
            return [{
                "name": "Agriculture durable",
                "description": "Techniques agricoles respectueuses de l'environnement adaptées au climat camerounais",
                "category": "Agriculture",
                "related_courses": ["Agriculture et Agro-industrie"]
            }]
        elif data_type == 'courses':
            return [{
                "title": "Agriculture et Agro-industrie",
                "description": "Formation en techniques agricoles modernes et transformation des produits agricoles adaptées au contexte camerounais",
                "category": "Agriculture",
                "instructor": "Dr. Jean Mbarga",
                "duration": "6 mois",
                "prerequisites": ["Baccalauréat"],
                "skills_gained": ["Techniques agricoles modernes", "Gestion d'exploitation", "Transformation agro-alimentaire"],
                "related_careers": ["Agronome", "Agro-industriel", "Technicien agricole"],
                "students_enrolled_count": 350,
                "average_rating": 4.5,
                "status": "active"
            }]
        elif data_type == 'careers':
            return [{
                "title": "Ingénieur Agronome",
                "description": "Spécialiste de l'agriculture et de l'élevage au Cameroun",
                "industry": "Agriculture",
                "market_demand": "Élevée",
                "growth_rate": 15,
                "average_salary": 1800000,
                "job_openings_estimate": "High",
                "required_skills": ["Agronomie", "Gestion de projet", "Connaissances sols tropicaux"],
                "educational_paths": ["Master en Agronomie", "Ingénieur agricole"],
                "industry_partners": ["IRAD", "MINADER", "SODECOTON"]
            }]