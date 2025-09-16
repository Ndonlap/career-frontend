import React, { useState, useEffect } from "react";
import { Lightbulb, ArrowUpRight, Loader2 } from "lucide-react"; // Added Loader2 for loading spinner
import { useNavigate } from "react-router-dom"; // For redirection if not authenticated

// Import Services
import StudentService from "../../../services/student";
import AuthService from "../../../services/auth"; // To check authentication

// Removed RecommendationPageProps interface as data will be fetched internally
// interface RecommendationPageProps {
//   careerRecommendations: any[];
// }

// Changed to a simple functional component without props
const RecommendationPage: React.FC = () => {
  const navigate = useNavigate();

  // Internal states for this component
  const [careerRecommendations, setCareerRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Effect to fetch career recommendations on mount ---
  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Ensure user is authenticated before attempting to fetch recommendations
        if (!AuthService.getAccessToken()) {
          setError("Authentication required. Please log in.");
          navigate('/login'); // Redirect to login if no token
          return;
        }
        const response = await StudentService.getRecommendationsSummary();
        // Assuming the backend returns an array of recommendations directly
        setCareerRecommendations(response.data);
      } catch (err: any) {
        console.error("Error fetching career recommendations:", err);
        setError(err.response?.data?.msg || "Failed to load career recommendations.");
        // The Axios interceptor in api.js should also handle 401 redirects
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [navigate]); // navigate is a stable reference, but good practice to include

  // --- Loading and Error UI ---
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin mr-2 h-6 w-6 text-blue-500" />
        <p className="text-lg text-slate-700">Loading AI-powered recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-red-600">Error: {error}</p>
        {/* Optional: Add a button to retry or navigate home */}
        <button onClick={() => navigate('/StudentDashboard')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">
            Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <Lightbulb className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">AI-Powered Recommendations</h2>
          <p className="text-slate-600">Personalized guidance for your academic and career journey</p>
        </div>
        
        <div className="space-y-6">
          {careerRecommendations.length > 0 ? (
            careerRecommendations.map((career: any, index: number) => (
              <div key={career.id || index} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800">{career.title}</h3>
                    <p className="text-slate-600">Career Recommendation</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: career.color || "#3B82F6" }}>
                      {career.match}% Match
                    </div>
                    <p className="text-sm text-slate-600">Compatibility Score</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-green-600">{career.growth}</p>
                    <p className="text-xs text-slate-600">Job Growth</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="font-semibold text-blue-600">{career.salary}</p>
                    <p className="text-xs text-slate-600">Avg Salary</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="font-semibold text-purple-600">{career.demand}</p>
                    <p className="text-xs text-slate-600">Market Demand</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full">High Potential</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">Trending</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/StudentDashboard/recommendations/${career.id}`)} // Navigate to a detailed recommendation page
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Learn More <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-slate-500">No career recommendations available yet. Complete your profile and assessments!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendationPage;