class RecommendationService:
    def __init__(self):
        self.simulator = RecommendationSimulator()
    
    def generate_recommendations(self, student_id, counselor_id=None):
        """
        Main method to generate AI-like recommendations with 30-second simulation
        """
        print(f"🔍 Starting AI recommendation analysis for student {student_id}...")
        
        # Simulate AI processing time (30 seconds)
        self.simulate_ai_processing()
        
        # Get student data
        student_data = self.get_student_data(student_id)
        if not student_data:
            return self.get_fallback_recommendations(student_id)
        
        # Generate recommendations based on student profile
        recommendations = self.analyze_student_profile(student_data)
        
        # Save to database
        return self.save_recommendations(student_id, counselor_id, recommendations)
    
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
        
        for i, step in enumerate(steps):
            print(step)
            time.sleep(5)  # 5 seconds per step = 30 seconds total
            
            # Show progress percentage
            progress = ((i + 1) / len(steps)) * 100
            print(f"🔄 Progress: {progress:.0f}% complete")
    
    def get_student_data(self, student_id):
        """Retrieve and combine all student data"""
        try:
            # Get academic records
            academic_records = AcademicRecord.find_by_student_id(student_id)
            
            # Get assessment results (you'll need to implement this method)
            assessment_results = self.get_student_assessments(student_id)
            
            # Get student profile
            student_profile = User.find_by_id(student_id)
            
            return {
                'academic_records': [record.to_dict() for record in academic_records],
                'assessment_results': assessment_results,
                'profile': student_profile.to_dict() if student_profile else {},
                'strengths': self.analyze_strengths(academic_records, assessment_results),
                'interests': self.extract_interests(assessment_results),
                'skill_gaps': self.identify_skill_gaps(academic_records, assessment_results)
            }
        except Exception as e:
            print(f"Error getting student data: {e}")
            return None
    
    def analyze_student_profile(self, student_data):
        """Core recommendation logic based on Cameroonian context"""
        
        # Extract key student attributes
        academic_performance = self.calculate_academic_performance(student_data['academic_records'])
        interests = student_data['interests']
        strengths = student_data['strengths']
        skill_gaps = student_data['skill_gaps']
        
        # Career recommendations based on multiple factors
        career_recommendations = self.generate_career_recommendations(
            academic_performance, interests, strengths, skill_gaps
        )
        
        # Skill recommendations to address gaps
        skill_recommendations = self.generate_skill_recommendations(
            skill_gaps, career_recommendations
        )
        
        # Course recommendations for skill development
        course_recommendations = self.generate_course_recommendations(
            skill_recommendations, academic_performance
        )
        
        return {
            'career_recommendations': career_recommendations,
            'skill_recommendations': skill_recommendations,
            'course_recommendations': course_recommendations,
            'summary': self.generate_summary(career_recommendations, skill_recommendations),
            'confidence_score': self.calculate_confidence_score(student_data)
        }
    
    def generate_career_recommendations(self, academic_perf, interests, strengths, skill_gaps):
        """Generate career recommendations with Cameroonian market focus"""
        recommendations = []
        
        for career in self.simulator.careers_data:
            match_score = self.calculate_career_match_score(career, academic_perf, interests, strengths)
            
            if match_score >= 60:  # Only recommend if good match
                recommendations.append({
                    'career_title': career['title'],
                    'industry': career['industry'],
                    'match_score': match_score,
                    'market_demand': career['market_demand'],
                    'growth_rate': career['growth_rate'],
                    'average_salary': career['average_salary'],
                    'reasoning': self.generate_career_reasoning(career, academic_perf, interests),
                    'required_skills': career['required_skills'],
                    'educational_paths': career['educational_paths'],
                    'industry_partners': career.get('industry_partners', [])
                })
        
        # Sort by match score and return top 5
        return sorted(recommendations, key=lambda x: x['match_score'], reverse=True)[:5]
    
    def calculate_career_match_score(self, career, academic_perf, interests, strengths):
        """Calculate how well a career matches the student profile"""
        score = 0
        
        # Academic performance factor (30%)
        if academic_perf >= 80:  # High performer
            score += 30
        elif academic_perf >= 60:
            score += 20
        else:
            score += 10
        
        # Interest alignment (25%)
        interest_keywords = ['agriculture', 'technologie', 'santé', 'éducation', 'commerce']
        career_desc = career['description'].lower() + career['title'].lower()
        
        for keyword in interest_keywords:
            if keyword in career_desc and any(keyword in interest.lower() for interest in interests):
                score += 25
                break
        
        # Strength alignment (25%)
        career_skills = [skill.lower() for skill in career['required_skills']]
        student_strengths = [strength.lower() for strength in strengths]
        
        matching_strengths = set(career_skills) & set(student_strengths)
        if matching_strengths:
            score += (len(matching_strengths) / len(career_skills)) * 25
        
        # Market demand factor (20%)
        demand_scores = {'Élevée': 20, 'Moyenne': 15, 'Faible': 10}
        score += demand_scores.get(career['market_demand'], 10)
        
        return min(score, 100)  # Cap at 100
    
    def generate_skill_recommendations(self, skill_gaps, career_recommendations):
        """Recommend skills to develop based on career goals"""
        recommendations = []
        
        for career_rec in career_recommendations[:3]:  # Top 3 careers
            career_skills = career_rec['required_skills']
            
            for skill_name in career_skills:
                # Find skill in database
                skill_data = next((s for s in self.simulator.skills_data 
                                 if s['name'].lower() == skill_name.lower()), None)
                
                if skill_data and skill_name in skill_gaps:
                    recommendations.append({
                        'skill_name': skill_data['name'],
                        'category': skill_data['category'],
                        'description': skill_data['description'],
                        'priority': 'high' if career_rec['match_score'] >= 80 else 'medium',
                        'related_careers': [career_rec['career_title']],
                        'development_resources': self.find_skill_resources(skill_data['name'])
                    })
        
        return recommendations[:10]  # Limit to 10 skills
    
    def generate_course_recommendations(self, skill_recommendations, academic_perf):
        """Recommend courses to develop recommended skills"""
        recommendations = []
        
        for skill_rec in skill_recommendations:
            # Find courses that teach this skill
            matching_courses = [course for course in self.simulator.courses_data 
                              if skill_rec['skill_name'] in course.get('skills_gained', [])]
            
            for course in matching_courses:
                # Check if student meets prerequisites
                if self.meets_prerequisites(academic_perf, course.get('prerequisites', [])):
                    recommendations.append({
                        'course_title': course['title'],
                        'instructor': course['instructor'],
                        'duration': course['duration'],
                        'skills_covered': course['skills_gained'],
                        'rating': course['average_rating'],
                        'enrollment_count': course['students_enrolled_count'],
                        'reason': f"Développe la compétence: {skill_rec['skill_name']}",
                        'match_score': 85  # High match for skill development
                    })
        
        return recommendations[:5]  # Top 5 courses
    
    def generate_summary(self, careers, skills):
        """Generate AI-style summary of recommendations"""
        if not careers:
            return "Recommandations en attente de plus de données académiques."
        
        top_career = careers[0]
        top_skills = [s['skill_name'] for s in skills[:3]]
        
        return f"""Basé sur votre profil académique et vos intérêts, je recommande particulièrement une carrière dans {top_career['industry']}. 
Vos forces actuelles s'alignent bien avec le poste de {top_career['career_title']} qui connaît une croissance de {top_career['growth_rate']}% au Cameroun.
Pour maximiser votre potentiel, concentrez-vous sur le développement des compétences suivantes: {', '.join(top_skills)}.
Ce cheminement offre un salaire moyen de {top_career['average_salary']:,.0f} FCFA avec une demande {top_career['market_demand'].lower()} sur le marché."""
    
    def calculate_confidence_score(self, student_data):
        """Calculate how confident the system is in its recommendations"""
        confidence = 70  # Base confidence
        
        # More academic data = higher confidence
        if len(student_data['academic_records']) >= 3:
            confidence += 10
        
        # Assessment results available = higher confidence
        if student_data['assessment_results']:
            confidence += 15
        
        # Strong academic performance = higher confidence
        academic_perf = self.calculate_academic_performance(student_data['academic_records'])
        if academic_perf >= 75:
            confidence += 5
        
        return min(confidence, 100)
    
    # Helper methods
    def calculate_academic_performance(self, academic_records):
        if not academic_records:
            return 0
        return sum(record['average_score'] for record in academic_records) / len(academic_records)
    
    def extract_interests(self, assessment_results):
        # Simplified interest extraction - would be more complex in real AI
        return ['technologie', 'agriculture', 'leadership']  # Placeholder
    
    def identify_skill_gaps(self, academic_records, assessment_results):
        # Simplified gap analysis
        return ['Gestion de projet', 'Communication', 'Analyse de données']
    
    def analyze_strengths(self, academic_records, assessment_results):
        # Extract strengths from academic performance
        strengths = []
        if self.calculate_academic_performance(academic_records) > 80:
            strengths.extend(['Analytique', 'Travail assidu'])
        return strengths
    
    def meets_prerequisites(self, academic_perf, prerequisites):
        # Simplified prerequisite check
        return academic_perf >= 60  # Basic academic requirement
    
    def find_skill_resources(self, skill_name):
        return [f"Cours en ligne: {skill_name}", f"Livre: Maîtriser {skill_name}"]
    
    def get_student_assessments(self, student_id):
        # Placeholder - implement based on your AssessmentResult model
        return []
    
    def get_fallback_recommendations(self, student_id):
        """Provide basic recommendations when student data is limited"""
        return {
            'career_recommendations': [{
                'career_title': 'Conseiller en Orientation',
                'match_score': 65,
                'reasoning': 'Carrière par défaut en attendant plus de données'
            }],
            'skill_recommendations': [],
            'course_recommendations': [],
            'summary': 'Données étudiantes limitées. Complétez votre profil pour des recommandations personnalisées.',
            'confidence_score': 30
        }
    
    def save_recommendations(self, student_id, counselor_id, recommendations):
        """Save recommendations to database using your Recommendation model"""
        
        # Create career recommendation
        career_rec = Recommendation(
            student_id=student_id,
            type="career",
            match_score=recommendations['confidence_score'],
            summary=recommendations['summary'],
            counselor_id=counselor_id,
            recommended_courses=recommendations['course_recommendations'],
            suggested_skills=recommendations['skill_recommendations'],
            status="Generated",
            generated_by="AI Simulation"
        )
        
        career_id = career_rec.save()
        
        return {
            'success': True,
            'message': 'Recommandations générées avec succès',
            'recommendation_id': str(career_id),
            'data': recommendations,
            'processing_time': '30 seconds',
            'generated_at': datetime.utcnow().isoformat()
        }