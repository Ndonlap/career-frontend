import time
from datetime import datetime
from bson.objectid import ObjectId

# Import models
from blueprints.shared.models import AcademicRecord, Recommendation
from blueprints.assessments.models import AssessmentResult
from services.ai_simulator import RecommendationSimulator

class RecommendationService:
    def __init__(self):
        self.simulator = RecommendationSimulator()
    
    def generate_recommendations(self, student_id):
        """Main method to generate AI-like recommendations with 30-second simulation"""
        print(f"🔍 Starting AI recommendation analysis for student {student_id}...")
        
        # Simulate AI processing time (30 seconds)
        # self.simulator.simulate_ai_processing()
        
        # Get student data including assessment results
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
        """Retrieve and combine all student data including assessment results"""
        try:
            academic_records = AcademicRecord.find_by_student_id(student_id)
            print(f"Found {len(academic_records)} academic records")
            
            # Get assessment results and analyze them
            assessment_results = self.get_student_assessments(student_id)
            print(f"Found {len(assessment_results)} assessment results")
            
            # Analyze assessment results to get strengths, interests, and skill gaps
            assessment_analysis = self.analyze_assessment_results(assessment_results)
            
            return {
                'academic_records': [record.to_dict() for record in academic_records],
                'assessment_results': assessment_results,
                'strengths': assessment_analysis['strengths'],
                'interests': assessment_analysis['interests'],
                'skill_gaps': assessment_analysis['skill_gaps'],
                'assessment_scores': assessment_analysis['scores']
            }
        except Exception as e:
            print(f"Error getting student data: {e}")
            return None
    
    def analyze_assessment_results(self, assessment_results):
        """Analyze assessment results to extract strengths, interests, and skill gaps"""
        if not assessment_results:
            print("No assessment results found, using default values")
            return {
                'strengths': ['Adaptable', 'Quick Learner'],
                'interests': ['technology', 'agriculture', 'leadership', 'innovation'],
                'skill_gaps': ['Project Management', 'Communication', 'Data Analysis', 'Critical Thinking'],
                'scores': {'strengths': 70, 'interests': 70, 'skill_gaps': 70}
            }
        
        # Initialize analysis
        strengths = []
        interests = []
        skill_gaps = []
        category_scores = {}
        
        for result in assessment_results:
            insights = result.get('insights', {})
            score = result.get('score', 0)
            total_points = result.get('total_points_possible', 1)
            normalized_score = (score / total_points) * 100 if total_points > 0 else 0
            
            # Determine assessment type based on content or use default logic
            assessment_type = self.determine_assessment_type(result, insights)
            
            if assessment_type == 'strengths':
                strengths.extend(insights.get('strengths', []))
                category_scores['strengths'] = normalized_score
            elif assessment_type == 'interests':
                interests.extend(insights.get('interests', []))
                category_scores['interests'] = normalized_score
            elif assessment_type == 'skill_gaps':
                skill_gaps.extend(insights.get('weaknesses', []))
                category_scores['skill_gaps'] = normalized_score
        
        # Remove duplicates and ensure we have values
        strengths = list(set(strengths)) if strengths else ['Analytical Thinking', 'Hard Working']
        interests = list(set(interests)) if interests else ['technology', 'agriculture', 'innovation']
        skill_gaps = list(set(skill_gaps)) if skill_gaps else ['Project Management', 'Communication']
        
        # Ensure we have default scores if assessments are missing
        if 'strengths' not in category_scores:
            category_scores['strengths'] = 75
        if 'interests' not in category_scores:
            category_scores['interests'] = 70
        if 'skill_gaps' not in category_scores:
            category_scores['skill_gaps'] = 65
        
        print(f"Assessment analysis - Strengths: {strengths}, Interests: {interests}, Skill gaps: {skill_gaps}")
        print(f"Assessment scores: {category_scores}")
        
        return {
            'strengths': strengths,
            'interests': interests,
            'skill_gaps': skill_gaps,
            'scores': category_scores
        }
    
    def determine_assessment_type(self, assessment_result, insights):
        """Determine what type of assessment this is (strengths, interests, skill_gaps)"""
        assessment_id = assessment_result.get('assessment_id', '')
        
        # You might want to store assessment type in your assessment data
        # For now, we'll infer based on content
        insights_data = str(insights).lower()
        
        if any(keyword in insights_data for keyword in ['strength', 'strong', 'ability', 'capability']):
            return 'strengths'
        elif any(keyword in insights_data for keyword in ['interest', 'passion', 'enjoy', 'preference']):
            return 'interests'
        elif any(keyword in insights_data for keyword in ['weakness', 'gap', 'improve', 'develop']):
            return 'skill_gaps'
        else:
            # Default based on score pattern
            score = assessment_result.get('score', 0)
            total_points = assessment_result.get('total_points_possible', 1)
            normalized_score = (score / total_points) * 100 if total_points > 0 else 0
            
            if normalized_score >= 70:
                return 'strengths'
            elif normalized_score >= 50:
                return 'interests'
            else:
                return 'skill_gaps'
    
    def analyze_student_profile(self, student_data):
        """Core recommendation logic using assessment data"""
        print("Analyzing student profile with assessment data...")
        
        academic_records = student_data['academic_records']
        print(f"Processing {len(academic_records)} academic records")
        
        academic_performance = self.calculate_academic_performance(academic_records)
        interests = student_data['interests']
        strengths = student_data['strengths']
        skill_gaps = student_data['skill_gaps']
        assessment_scores = student_data['assessment_scores']
        
        print(f"Academic performance: {academic_performance}")
        print(f"Interests: {interests} (score: {assessment_scores.get('interests', 'N/A')})")
        print(f"Strengths: {strengths} (score: {assessment_scores.get('strengths', 'N/A')})")
        print(f"Skill gaps: {skill_gaps} (score: {assessment_scores.get('skill_gaps', 'N/A')})")
        
        career_recommendations = self.generate_career_recommendations(
            academic_performance, interests, strengths, skill_gaps, assessment_scores
        )
        print(f"Generated {len(career_recommendations)} career recommendations")
        
        # FIXED: Use the actual skill recommendation generation
        skill_recommendations = self.generate_skill_recommendations(skill_gaps, career_recommendations, assessment_scores)
        print(f"Generated {len(skill_recommendations)} skill recommendations")
        
        # FIXED: Use the actual course recommendation generation
        course_recommendations = self.generate_course_recommendations(skill_recommendations, academic_performance)
        print(f"Generated {len(course_recommendations)} course recommendations")
        
        return {
            'career_recommendations': career_recommendations,
            'skill_recommendations': skill_recommendations,
            'course_recommendations': course_recommendations,
            'summary': self.generate_summary(career_recommendations, assessment_scores),
            'confidence_score': self.calculate_confidence_score(student_data)
        }
    def generate_career_recommendations(self, academic_perf, interests, strengths, skill_gaps, assessment_scores):
        """Generate career recommendations using assessment data"""
        recommendations = []
        
        print(f"Available careers data: {len(self.simulator.careers_data)} careers")
        
        for career in self.simulator.careers_data:
            career_title = career.get('title', 'Unknown Career')
            print(f"Processing career: {career_title}")
            
            match_score = self.calculate_career_match_score(
                career, academic_perf, interests, strengths, skill_gaps, assessment_scores
            )
            print(f"Match score for {career_title}: {match_score}%")
            
            if int(match_score) >= 40:
                recommendations.append({
                    'career_title': career_title,
                    'industry': career.get('industry', 'General'),
                    'match_score': match_score,
                    'market_demand': career.get('market_demand', 'Medium'),
                    'growth_rate': career.get('growth_rate', 10),
                    'average_salary': career.get('average_salary', 1000000),
                    'reasoning': self.generate_career_reasoning(career, strengths, interests, assessment_scores),
                    'required_skills': career.get('required_skills', []),
                    'educational_paths': career.get('educational_paths', [])
                })
        
        # Sort by match score and return top 3
        sorted_recommendations = sorted(recommendations, key=lambda x: x['match_score'], reverse=True)[:3]
        print(f"Final career recommendations: {len(sorted_recommendations)}")
        return sorted_recommendations
    
    def calculate_career_match_score(self, career, academic_perf, interests, strengths, skill_gaps, assessment_scores):
        """Calculate career match score using assessment data"""
        score = 0
        
        # Academic performance factor (20%)
        if academic_perf >= 80:
            score += 20
        elif academic_perf >= 60:
            score += 15
        else:
            score += 10
        
        # Interest alignment (30% - increased importance)
        career_desc = (career.get('description', '') + ' ' + career.get('title', '')).lower()
        interest_match = False
        for interest in interests:
            if interest.lower() in career_desc:
                interest_match = True
                break
        
        if interest_match:
            # Weight by interest assessment score
            interest_score = assessment_scores.get('interests', 70)
            interest_weight = (interest_score / 100) * 30
            score += interest_weight
        else:
            score += 10  # Base score even without direct match
        
        # Strength alignment (30% - increased importance)
        career_skills = [skill.lower() for skill in career.get('required_skills', [])]
        student_strengths = [strength.lower() for strength in strengths]
        
        matching_strengths = set(career_skills) & set(student_strengths)
        if matching_strengths and career_skills:
            # Weight by strengths assessment score
            strength_score = assessment_scores.get('strengths', 70)
            strength_weight = (strength_score / 100) * 30
            match_ratio = len(matching_strengths) / len(career_skills)
            score += match_ratio * strength_weight
        
        # Market demand factor (20%)
        demand_scores = {'High': 20, 'Medium': 15, 'Low': 10, 'Élevée': 20, 'Moyenne': 15, 'Faible': 10}
        market_demand = career.get('market_demand', 'Medium')
        score += demand_scores.get(market_demand, 10)
        
        return min(round(score, 2), 100)
    
    def generate_career_reasoning(self, career, strengths, interests, assessment_scores):
        """Generate personalized reasoning for career recommendation"""
        career_title = career.get('title', 'Unknown Career')
        reasoning_parts = []
        
        # Add strength-based reasoning
        if strengths:
            reasoning_parts.append(f"aligns with your strengths in {', '.join(strengths[:2])}")
        
        # Add interest-based reasoning
        career_desc = career.get('description', '').lower()
        matched_interests = [interest for interest in interests if interest.lower() in career_desc]
        if matched_interests:
            reasoning_parts.append(f"matches your interests in {', '.join(matched_interests[:2])}")
        
        # Add assessment score context
        strength_score = assessment_scores.get('strengths', 0)
        interest_score = assessment_scores.get('interests', 0)
        
        if strength_score >= 80:
            reasoning_parts.append("strong assessment results in key skill areas")
        if interest_score >= 80:
            reasoning_parts.append("high alignment with your assessed interests")
        
        if not reasoning_parts:
            reasoning_parts.append("good potential based on your overall profile")
        
        return f"Recommended because it {', '.join(reasoning_parts)}."
    
    def generate_skill_recommendations(self, skill_gaps, career_recommendations, assessment_scores):
        """Recommend skills to develop based on assessment-identified gaps"""
        recommendations = []
        
        # Use assessment-identified skill gaps as primary source
        skill_gap_score = assessment_scores.get('skill_gaps', 65)
        priority_base = 'high' if skill_gap_score <= 60 else 'medium'
        
        for skill_name in skill_gaps[:4]:  # Top 4 identified skill gaps
            skill_data = next((s for s in self.simulator.skills_data 
                            if s.get('name', '').lower() == skill_name.lower()), None)
            
            if skill_data:
                recommendations.append({
                    'skill_name': skill_data.get('name', 'Unknown Skill'),
                    'category': skill_data.get('category', 'General'),
                    'description': skill_data.get('description', 'No description available'),
                    'priority': priority_base,
                    'reasoning': f"Identified as development area in your assessment (score: {skill_gap_score}%)",
                    'demand_level': skill_data.get('demand_level', 'Medium'),
                    'difficulty': skill_data.get('difficulty', 'Intermediate')
                })
        
        # Supplement with career-required skills from top career recommendations
        for career_rec in career_recommendations[:2]:
            required_skills = career_rec.get('required_skills', [])
            
            for skill_name in required_skills:
                if skill_name not in [rec['skill_name'] for rec in recommendations]:
                    skill_data = next((s for s in self.simulator.skills_data 
                                    if s.get('name', '').lower() == skill_name.lower()), None)
                    
                    if skill_data:
                        recommendations.append({
                            'skill_name': skill_data.get('name', 'Unknown Skill'),
                            'category': skill_data.get('category', 'General'),
                            'description': skill_data.get('description', 'No description available'),
                            'priority': 'medium',
                            'reasoning': f"Required for {career_rec.get('career_title')} career path",
                            'demand_level': skill_data.get('demand_level', 'Medium'),
                            'difficulty': skill_data.get('difficulty', 'Intermediate')
                        })
        
        return recommendations[:6]  # Return top 6 skills
        
    def generate_course_recommendations(self, skill_recommendations, academic_perf):
        """Recommend courses to develop recommended skills"""
        recommendations = []
        
        for skill_rec in skill_recommendations:
            skill_name = skill_rec.get('skill_name', '')
            
            # Enhanced matching: Check both skills_gained and related_careers
            matching_courses = []
            for course in self.simulator.courses_data:
                # Check if skill is in skills_gained
                skills_gained = [s.lower() for s in course.get('skills_gained', [])]
                if skill_name.lower() in skills_gained:
                    matching_courses.append(course)
                # Also check if course is related to the skill category
                elif skill_rec.get('category', '').lower() in course.get('category', '').lower():
                    matching_courses.append(course)
            
            for course in matching_courses[:2]:  # Limit to 2 courses per skill
                recommendations.append({
                    'course_title': course.get('title', 'Unknown Course'),
                    'instructor': course.get('instructor', 'Unknown Instructor'),
                    'duration': course.get('duration', 'Unknown Duration'),
                    'skills_covered': course.get('skills_gained', []),
                    'rating': course.get('average_rating', 0),
                    'enrollment_count': course.get('students_enrolled_count', 0),
                    'priority': skill_rec.get('priority', 'medium'),
                    'institution': course.get('institution', 'Unknown'),
                    'cost': course.get('cost', 0),
                    'certification': course.get('certification', 'Unknown')
                })
        
        # Remove duplicates and return top courses
        unique_recommendations = []
        seen_titles = set()
        for rec in recommendations:
            if rec['course_title'] not in seen_titles:
                unique_recommendations.append(rec)
                seen_titles.add(rec['course_title'])
        
        return unique_recommendations[:5]  # Return top 5 unique courses
        
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
    
    def get_student_assessments(self, student_id):
        """Get student assessment results from database"""
        try:
            # Get assessment results with populated assessment details
            assessment_results = AssessmentResult.find_by_student_id(student_id, include_assessment_details=True)
            
            # Convert to dictionaries for easier processing
            results_dicts = []
            for result in assessment_results:
                result_dict = result.to_dict(include_assessment_details=True)
                results_dicts.append(result_dict)
            
            # print(f"Retrieved {len(results_dicts)} assessment results for student {student_id}")
            return results_dicts
            
        except Exception as e:
            print(f"Error getting assessment results: {e}")
            return []
   
    def generate_summary(self, careers, assessment_scores):
        """Generate comprehensive summary including career, skills, and courses with scores"""
        if not careers:
            return "Recommendations pending more academic and assessment data. Complete your assessments for personalized guidance."
        
        top_career = careers[0]
        
        # Include assessment context in summary
        strength_score = assessment_scores.get('strengths', 0)
        interest_score = assessment_scores.get('interests', 0)
        skill_gap_score = assessment_scores.get('skill_gaps', 0)
        
        # Build assessment context
        assessment_context = ""
        if strength_score >= 80:
            assessment_context += " Your strong skills assessment shows excellent capabilities. "
        elif strength_score <= 60:
            assessment_context += " Consider developing core competencies further. "
        
        if interest_score >= 80:
            assessment_context += "High interest alignment indicates good career fit. "
        elif interest_score <= 60:
            assessment_context += "Explore additional interests to broaden opportunities. "
        
        if skill_gap_score <= 60:
            assessment_context += "Focus on addressing identified skill gaps for career success."
        
        # Extract key skills and courses from the top career
        required_skills = top_career.get('required_skills', [])[:3]  # Top 3 skills
        educational_paths = top_career.get('educational_paths', [])[:2]  # Top 2 courses
        
        # Build skills section
        skills_section = ""
        if required_skills:
            skills_text = ", ".join(required_skills)
            skills_section = f" Key skills needed: {skills_text}."
        
        # Build courses section
        courses_section = ""
        if educational_paths:
            courses_text = ", ".join(educational_paths)
            courses_section = f" Recommended education: {courses_text}."
        
        # Career-specific insights based on match score
        match_insight = ""
        match_score = top_career.get('match_score', 0)
        if match_score >= 80:
            match_insight = " Excellent alignment with your profile!"
        elif match_score >= 60:
            match_insight = " Good potential match for your strengths and interests."
        else:
            match_insight = " Solid foundation with room for skill development."
        
        # Market insights
        market_demand = top_career.get('market_demand', 'Medium')
        growth_rate = top_career.get('growth_rate', 0)
        salary = top_career.get('average_salary', 0)
        
        market_insight = f" This career has {market_demand.lower()} market demand"
        if growth_rate > 15:
            market_insight += f", strong growth ({growth_rate}% annually)"
        if salary > 2000000:
            market_insight += f", and competitive salary (≈{salary:,} FCFA)"
        
        # Compile final summary
        summary_parts = [
            f"🏆 Top Recommendation: {top_career['career_title']}",
            f"📊 Match Score: {match_score}%{match_insight}",
            f"🏭 Industry: {top_career['industry']}",
            f"📈 Market Outlook:{market_insight}.",
            f"🛠️ Skills Development:{skills_section}",
            f"🎓 Education Path:{courses_section}",
            f"📋 Assessment Insights:{assessment_context}"
        ]
        
        return " ".join(summary_parts)

    def calculate_confidence_score(self, student_data):
        """Calculate confidence score for recommendations based on data quality"""
        confidence = 50  # Base confidence
        
        academic_records = student_data.get('academic_records', [])
        assessment_results = student_data.get('assessment_results', [])
        
        # Academic data quality (25 points max)
        if len(academic_records) >= 3:
            confidence += 15
        elif len(academic_records) >= 1:
            confidence += 10
            
        academic_perf = self.calculate_academic_performance(academic_records)
        if academic_perf >= 75:
            confidence += 10
            
        # Assessment data quality (25 points max)
        if len(assessment_results) >= 2:
            confidence += 20
        elif len(assessment_results) >= 1:
            confidence += 10
            
        # Data completeness (additional points)
        if student_data.get('strengths') and student_data.get('interests') and student_data.get('skill_gaps'):
            confidence += 15
            
        return min(confidence, 100)
    
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
                'reasoning': 'Good starting point while we gather more assessment data about your interests and skills',
                'required_skills': ['Counseling', 'Communication', 'Psychology'],
                'educational_paths': ['Psychology Degree', 'Counseling Certification']
            }],
            'skill_recommendations': [{
                'skill_name': 'Self-Assessment',
                'category': 'Personal Development',
                'description': 'Ability to evaluate personal strengths and interests',
                'priority': 'high',
                'reasoning': 'Complete your assessments for more personalized skill recommendations'
            }],
            'course_recommendations': [{
                'course_title': 'Career Exploration Fundamentals',
                'instructor': 'Career Development Center',
                'duration': '4 weeks',
                'skills_covered': ['Self-assessment', 'Career Research', 'Goal Setting'],
                'rating': 4.2,
                'enrollment_count': 150,
                'priority': 'high'
            }],
            'summary': 'Limited assessment data available. Complete your strength, interest, and skill gap assessments for more personalized recommendations.',
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