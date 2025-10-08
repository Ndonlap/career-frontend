import React, { useState, useEffect } from "react";
import { Lightbulb, ArrowUpRight, Loader2, Zap, RefreshCw, Calendar, BookOpen, Target, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Import Services
import StudentService from "../../../services/student";
import AuthService from "../../../services/auth";

interface Recommendation {
  id: string;
  type: string;
  match_score: number;
  summary: string;
  status: string;
  generated_by: string;
  recommended_courses: Array<{
    course_title: string;
    instructor: string;
    duration: string;
    skills_covered: string[];
    rating: number;
  }>;
  suggested_skills: Array<{
    skill_name: string;
    category: string;
    description: string;
    priority: string;
  }>;
  created_at: string;
  confidence_score?: number;
}

const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();

  // States for recommendations
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'career' | 'skills' | 'courses'>('all');

  // Fetch existing recommendations on component mount
  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!AuthService.getAccessToken()) {
        setError("Authentication required. Please log in.");
        navigate('/login');
        return;
      }
      console.log("AuthService.getUserId()",AuthService.getUserId())

      const response = await StudentService.getStudentRecommendations(AuthService.getUserId());
      setRecommendations(response.data.recommendations || []);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.msg || "Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  // Generate new recommendations
  const generateNewRecommendations = async () => {
    setGenerating(true);
    try {
      const result = await Swal.fire({
        title: 'Generate New Recommendations?',
        text: "This will create new AI-powered recommendations based on your current profile. This process takes about 30 seconds.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, generate!',
        cancelButtonText: 'Cancel'
      });

      if (!result.isConfirmed) {
        return;
      }
      const response = await StudentService.generateRecommendations();
      
      Swal.fire({
        icon: 'success',
        title: 'Recommendations Generated!',
        text: 'Your new AI recommendations are ready.',
        timer: 3000,
        showConfirmButton: false
      });

      // Refresh the recommendations list
      await fetchRecommendations();
      
    } catch (err: any) {
      console.error("Error generating recommendations:", err);
      Swal.fire({
        icon: 'error',
        title: 'Generation Failed',
        text: err.response?.data?.msg || 'Failed to generate recommendations. Please try again.'
      });
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [navigate]);

  // Filter recommendations based on selected tab
  const filteredRecommendations = recommendations.filter(rec => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'career') return rec.type === 'career';
    if (selectedTab === 'skills') return rec.suggested_skills.length > 0;
    if (selectedTab === 'courses') return rec.recommended_courses.length > 0;
    return true;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={fetchRecommendations}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">AI Recommendations</h1>
                <p className="text-slate-600">Personalized career and skill guidance powered by AI</p>
              </div>
            </div>
            
            <button
              onClick={generateNewRecommendations}
              disabled={generating}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <Zap className="h-5 w-5" />
              )}
              {generating ? 'Generating...' : 'Generate New'}
            </button>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{recommendations.length}</div>
              <div className="text-sm text-slate-600">Total Recommendations</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {recommendations.filter(r => r.type === 'career').length}
              </div>
              <div className="text-sm text-slate-600">Career Paths</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {recommendations.reduce((acc, r) => acc + r.suggested_skills.length, 0)}
              </div>
              <div className="text-sm text-slate-600">Skills Suggested</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {recommendations.reduce((acc, r) => acc + r.recommended_courses.length, 0)}
              </div>
              <div className="text-sm text-slate-600">Courses Recommended</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Recommendations', icon: Lightbulb },
              { id: 'career', label: 'Career Paths', icon: Target },
              { id: 'skills', label: 'Skills Development', icon: Star },
              { id: 'courses', label: 'Recommended Courses', icon: BookOpen }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recommendations List */}
        <div className="space-y-6">
  {filteredRecommendations.length > 0 ? (
    filteredRecommendations.map((recommendation, index) => (
      <div key={recommendation.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
        {/* Recommendation Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-gray-900 capitalize">
                  {recommendation.type} Recommendations
                </h3>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  recommendation.status === 'Generated' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                }`}>
                  {recommendation.status}
                </span>
              </div>
              <p className="text-gray-700">{recommendation.summary}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-gray-900">
                  {recommendation.match_score}%
                </span>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                Generated {formatDate(recommendation.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendation Content */}
        <div className="p-6">
          {/* Skills Section */}
          {recommendation.suggested_skills.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                Recommended Skills
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendation.suggested_skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="p-4 border border-gray-200 rounded-xl bg-white hover:border-blue-300 transition-colors duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-900">{skill.skill_name}</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(skill.priority)}`}>
                        {skill.priority} Priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{skill.description}</p>
                    <div className="mt-2">
                      <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {skill.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Courses Section */}
          {recommendation.recommended_courses.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Recommended Courses
              </h4>
              <div className="space-y-4">
                {recommendation.recommended_courses.map((course, courseIndex) => (
                  <div key={courseIndex} className="p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 text-lg">{course.course_title}</h5>
                      <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                        <Star className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-semibold text-amber-700">{course.rating}/5.0</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{course.instructor} • {course.duration}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.skills_covered.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full border border-blue-200">
                          {skill}
                        </span>
                      ))}
                      {course.skills_covered.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full border border-gray-200">
                          +{course.skills_covered.length - 3} more
                        </span>
                      )}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline flex items-center gap-2 transition-colors duration-200">
                      View Course Details 
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    ))
  ) : (
    /* Empty State */
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
      <Lightbulb className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {selectedTab !== 'all' 
          ? `No ${selectedTab} recommendations found. Try generating new recommendations or check other categories.`
          : "You don't have any AI recommendations yet. Generate your first set of personalized recommendations!"
        }
      </p>
      <button
        onClick={generateNewRecommendations}
        disabled={generating}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl mx-auto font-semibold"
      >
        {generating ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <Zap className="h-5 w-5" />
        )}
        {generating ? 'Generating...' : 'Generate Recommendations'}
      </button>
    </div>
  )}
</div>
      </div>
    </div>
  );
};

export default RecommendationPage;