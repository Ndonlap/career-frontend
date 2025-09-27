import time
from datetime import datetime
from bson.objectid import ObjectId

# Import models
from blueprints.shared.models import AcademicRecord, Appointment, Recommendation, Course, Career, Skill
from services.ai_simulator import RecommendationSimulator

class RecommendationService:
    def __init__(self):
        self.simulator = RecommendationSimulator()
    
    def generate_recommendations(self, student_id):
        """Main method to generate AI-like recommendations with 30-second simulation"""
        print(f"🔍 Starting AI recommendation analysis for student {student_id}...")
        
        # Simulate AI processing time (30 seconds)
        self.simulator.simulate_ai_processing()
        
        # Get student data
        student_data = self.get_student_data(student_id)
        if not student_data:
            print("Using fallback recommendations - insufficient student data")
            return self.get_fallback_recommendations(student_id)
        
        # Generate recommendations based on student profile
        recommendations = self.analyze_student_profile(student_data)
        print("Generated recommendations:", recommendations)
        
        # Save to database
        return self.save_recommendations(student_id, recommendations)
    
    def get_student_data(self, student_id):
        """Retrieve and combine all student data"""
        try:
            academic_records = AcademicRecord.find_by_student_id(student_id)
            print(f"Found {len(academic_records)} academic records")
            
            return {
                'academic_records': [record.to_dict() for record in academic_records],
                'assessment_results': self.get_student_assessments(student_id),
                'strengths': self.analyze_strengths(academic_records),
                'interests': self.extract_interests(),
                'skill_gaps': self.identify_skill_gaps(academic_records)
            }
        except Exception as e:
            print(f"Error getting student data: {e}")
            return None
    
    def analyze_student_profile(self, student_data):
        """Core recommendation logic"""
        print("Analyzing student profile...")
        
        # Fix: Ensure we're working with dictionaries, not strings
        academic_records = student_data['academic_records']
        print(f"Processing {len(academic_records)} academic records")
        
        academic_performance = self.calculate_academic_performance(academic_records)
        interests = student_data['interests']
        strengths = student_data['strengths']
        skill_gaps = student_data['skill_gaps']
        
        print(f"Academic performance: {academic_performance}")
        print(f"Interests: {interests}")
        print(f"Strengths: {strengths}")
        print(f"Skill gaps: {skill_gaps}")
        
        career_recommendations = self.generate_career_recommendations(
            academic_performance, interests, strengths, skill_gaps
        )
        print(f"Generated {len(career_recommendations)} career recommendations")
        
        skill_recommendations = self.generate_skill_recommendations(skill_gaps, career_recommendations)
        print(f"Generated {len(skill_recommendations)} skill recommendations")
        
        course_recommendations = self.generate_course_recommendations(skill_recommendations, academic_performance)
        print(f"Generated {len(course_recommendations)} course recommendations")
        
        return {
            'career_recommendations': career_recommendations,
            'skill_recommendations': skill_recommendations,
            'course_recommendations': course_recommendations,
            'summary': self.generate_summary(career_recommendations),
            'confidence_score': self.calculate_confidence_score(student_data)
        }
    
    def generate_career_recommendations(self, academic_perf, interests, strengths, skill_gaps):
        """Generate career recommendations"""
        recommendations = []
        
        print(f"Available careers data: {len(self.simulator.careers_data)} careers")
        print(self.simulator.careers_data)
        
        for career in self.simulator.careers_data:
            # Debug: Check career structure
            print(career)
            print(f"Processing career: {career.get('title', 'Unknown')}")
            
            match_score = self.calculate_career_match_score(career, academic_perf, interests, strengths)
            print(f"Match score for {career.get('title', 'Unknown')}: {match_score}%")
            
            if match_score >= 60:
                recommendations.append({
                    'career_title': career.get('title', 'Unknown Career'),
                    'industry': career.get('industry', 'General'),
                    'match_score': match_score,
                    'market_demand': career.get('market_demand', 'Medium'),
                    'growth_rate': career.get('growth_rate', 10),
                    'average_salary': career.get('average_salary', 1000000),
                    'reasoning': f"Good alignment with your skills in {strengths[0] if strengths else 'analysis'}",
                    'required_skills': career.get('required_skills', []),
                    'educational_paths': career.get('educational_paths', [])
                })
        
        # Sort by match score and return top 3
        sorted_recommendations = sorted(recommendations, key=lambda x: x['match_score'], reverse=True)[:3]
        print(f"Final career recommendations: {len(sorted_recommendations)}")
        return sorted_recommendations
    
    def calculate_career_match_score(self, career, academic_perf, interests, strengths):
        """Calculate career match score"""
        score = 0
        
        # Academic performance factor (30%)
        if academic_perf >= 80:
            score += 30
        elif academic_perf >= 60:
            score += 20
        else:
            score += 10
        
        # Interest alignment (25%)
        career_desc = (career.get('description', '') + ' ' + career.get('title', '')).lower()
        if any(keyword in career_desc for keyword in ['technology', 'agriculture', 'health', 'education', 'business']):
            score += 25
        
        # Market demand factor (20%)
        demand_scores = {'High': 20, 'Medium': 15, 'Low': 10, 'Élevée': 20, 'Moyenne': 15, 'Faible': 10}
        market_demand = career.get('market_demand', 'Medium')
        score += demand_scores.get(market_demand, 10)
        
        # Strength alignment (25%)
        career_skills = [skill.lower() for skill in career.get('required_skills', [])]
        student_strengths = [strength.lower() for strength in strengths]
        
        matching_strengths = set(career_skills) & set(student_strengths)
        if matching_strengths and career_skills:
            score += (len(matching_strengths) / len(career_skills)) * 25
        
        return min(score, 100)
    
    def generate_skill_recommendations(self, skill_gaps, career_recommendations):
        """Recommend skills to develop"""
        recommendations = []
        
        for career_rec in career_recommendations[:2]:
            required_skills = career_rec.get('required_skills', [])
            print(f"Required skills for {career_rec.get('career_title')}: {required_skills}")
            
            for skill_name in required_skills:
                skill_data = next((s for s in self.simulator.skills_data 
                                 if s.get('name', '').lower() == skill_name.lower()), None)
                
                if skill_data:
                    recommendations.append({
                        'skill_name': skill_data.get('name', 'Unknown Skill'),
                        'category': skill_data.get('category', 'General'),
                        'description': skill_data.get('description', 'No description available'),
                        'priority': 'high' if career_rec.get('match_score', 0) >= 80 else 'medium'
                    })
        
        return recommendations[:5]
    
    def generate_course_recommendations(self, skill_recommendations, academic_perf):
        """Recommend courses to develop recommended skills"""
        recommendations = []
        
        for skill_rec in skill_recommendations:
            skill_name = skill_rec.get('skill_name', '')
            matching_courses = [course for course in self.simulator.courses_data 
                              if skill_name in course.get('skills_gained', [])]
            
            for course in matching_courses:
                recommendations.append({
                    'course_title': course.get('title', 'Unknown Course'),
                    'instructor': course.get('instructor', 'Unknown Instructor'),
                    'duration': course.get('duration', 'Unknown Duration'),
                    'skills_covered': course.get('skills_gained', []),
                    'rating': course.get('average_rating', 0),
                    'enrollment_count': course.get('students_enrolled_count', 0)
                })
        
        return recommendations[:3]
    
    # Helper methods
    def calculate_academic_performance(self, academic_records):
        """Calculate average academic performance"""
        if not academic_records:
            print("No academic records found, using default performance score")
            return 70  # Default average
        
        # Ensure we're working with dictionaries that have average_score
        valid_records = [record for record in academic_records if isinstance(record, dict) and 'average_score' in record]
        
        if not valid_records:
            print("No valid academic records with average_score found")
            return 70
            
        scores = [record['average_score'] for record in valid_records]
        average = sum(scores) / len(scores)
        print(f"Calculated academic performance: {average} from {len(valid_records)} records")
        return average
    
    def extract_interests(self):
        """Extract student interests"""
        return ['technology', 'agriculture', 'leadership', 'innovation']
    
    def identify_skill_gaps(self, academic_records):
        """Identify skill gaps"""
        return ['Project Management', 'Communication', 'Data Analysis', 'Critical Thinking']
    
    def analyze_strengths(self, academic_records):
        """Analyze student strengths from academic performance"""
        if not academic_records:
            return ['Adaptable', 'Quick Learner']
            
        avg_score = self.calculate_academic_performance(academic_records)
        if avg_score > 80:
            return ['Analytical Thinking', 'Hard Working', 'Detail-Oriented']
        elif avg_score > 60:
            return ['Persistent', 'Curious', 'Adaptable']
        else:
            return ['Resilient', 'Determined', 'Hard Working']
    
    def generate_summary(self, careers):
        """Generate summary of recommendations"""
        if not careers:
            return "Recommendations pending more academic data. Complete your profile for personalized guidance."
        
        top_career = careers[0]
        return f"Top recommendation: {top_career['career_title']} with {top_career['match_score']}% match score. This career in {top_career['industry']} has {top_career['market_demand']} market demand and offers strong growth potential."
    
    def calculate_confidence_score(self, student_data):
        """Calculate confidence score for recommendations"""
        confidence = 70
        
        academic_records = student_data.get('academic_records', [])
        if len(academic_records) >= 2:
            confidence += 10
            
        if student_data.get('assessment_results'):
            confidence += 15
            
        academic_perf = self.calculate_academic_performance(academic_records)
        if academic_perf >= 75:
            confidence += 5
            
        return min(confidence, 100)
    
    def get_student_assessments(self, student_id):
        """Get student assessment results"""
        # Placeholder - implement based on your assessment system
        return []
    
    def get_fallback_recommendations(self, student_id):
        """Provide fallback recommendations when data is limited"""
        return {
            'career_recommendations': [{
                'career_title': 'Career Counselor',
                'industry': 'Education',
                'match_score': 65,
                'market_demand': 'Medium',
                'growth_rate': 8,
                'average_salary': 1200000,
                'reasoning': 'Good starting point while we gather more information about your interests and skills',
                'required_skills': ['Counseling', 'Communication', 'Psychology'],
                'educational_paths': ['Psychology Degree', 'Counseling Certification']
            }],
            'skill_recommendations': [{
                'skill_name': 'Self-Assessment',
                'category': 'Personal Development',
                'description': 'Ability to evaluate personal strengths and interests',
                'priority': 'high'
            }],
            'course_recommendations': [{
                'course_title': 'Career Exploration Fundamentals',
                'instructor': 'Career Development Center',
                'duration': '4 weeks',
                'skills_covered': ['Self-assessment', 'Career Research', 'Goal Setting'],
                'rating': 4.2,
                'enrollment_count': 150
            }],
            'summary': 'Limited student data available. Complete your academic profile and assessments for more personalized recommendations.',
            'confidence_score': 40
        }
    
    def save_recommendations(self, student_id, recommendations):
        """Save recommendations to database"""
        try:
            career_rec = Recommendation(
                student_id=student_id,
                type="career",
                match_score=recommendations['confidence_score'],
                summary=recommendations['summary'],
                recommended_courses=recommendations['course_recommendations'],
                suggested_skills=recommendations['skill_recommendations'],
                status="Generated",
                generated_by="AI Simulation"
            )
            
            career_id = career_rec.save()
            print(f"Successfully saved recommendation with ID: {career_id}")
            
            return {
                'success': True,
                'message': 'Recommendations generated successfully',
                'recommendation_id': str(career_id),
                'data': recommendations,
                'processing_time': '30 seconds',
                'generated_at': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            print(f"Error saving recommendations: {e}")
            return {
                'success': False,
                'message': f'Error saving recommendations: {str(e)}',
                'data': recommendations
            }