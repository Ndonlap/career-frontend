import json
import time
import os
from datetime import datetime

class RecommendationSimulator:
    def __init__(self):
        self.careers_data = self.load_static_data('careers_cameroon.json')
        self.skills_data = self.load_static_data('skills_cameroon.json')
        self.courses_data = self.load_static_data('courses_cameroon.json')
    
    def load_static_data(self, filename):
        """Load static JSON data from static folder"""
        try:
            filepath = os.path.join('static/uploads/resources', filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                print(f"✅ Successfully loaded {filename} with {len(data)} items")
                return data
        except FileNotFoundError:
            print(f"⚠️ Warning: {filename} not found at {filepath}, using sample data")
            return self.get_sample_data(filename)
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing {filename}: {e}, using sample data")
            return self.get_sample_data(filename)
    
    def get_sample_data(self, filename):
        """Provide comprehensive sample data"""
        if 'careers' in filename:
            return [
                {
                    "title": "Agricultural Engineer",
                    "description": "Specialist in agriculture and livestock in Cameroon",
                    "industry": "Agriculture",
                    "market_demand": "High",
                    "growth_rate": 15,
                    "average_salary": 1800000,
                    "required_skills": ["Agronomy", "Project Management", "Tropical Soil Knowledge"],
                    "educational_paths": ["Master in Agronomy", "Agricultural Engineering"],
                    "industry_partners": ["IRAD", "MINADER", "SODECOTON"]
                }
            ]
        # ... keep the rest of your sample data but translate to English
        return []
    
    def simulate_ai_processing(self):
        """Simulate 30 seconds of AI processing with progress updates"""
        steps = [
            "📊 Analyzing academic records...",
            "🧠 Processing assessment results...", 
            "🔍 Matching skills with market demand...",
            "📈 Evaluating career growth potential...",
            "🎯 Calculating optimal career paths...",
            "💡 Generating personalized recommendations..."
        ]
        
        print("🚀 Starting AI recommendation analysis...")
        for i, step in enumerate(steps):
            print(step)
            time.sleep(5)  # 5 seconds per step = 30 seconds total
            progress = ((i + 1) / len(steps)) * 100
            print(f"🔄 Progress: {progress:.0f}% complete")
        print("✅ AI analysis complete!")