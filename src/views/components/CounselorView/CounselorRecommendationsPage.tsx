import React, { useState, useEffect } from "react";
import { Lightbulb, Brain, Eye, Loader2, PlusCircle, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCounselorDashboard } from './CounselorDashboardLayout';

import CounselorService from "../../../services/counselor";

interface Recommendation {
  id: string;
  type: string; // e.g., "Career Path", "College Selection"
  student: string; // Student's full name
  status: string; // e.g., "Generated", "In Review", "Approved"
  match: string; // e.g., "94%"
  // Add other fields like growth, salary, demand if they are part of the main list view
}

const CounselorRecommendationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { counselorProfile } = useCounselorDashboard(); // For generating new recs

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!counselorProfile || !counselorProfile.id) {
        setError("Counselor profile not loaded. Cannot fetch recommendations.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await CounselorService.getRecommendations();
      // Assuming response.data is an array of recommendation objects
      const fetchedRecs: Recommendation[] = response.data.map((rec: any) => ({
        id: rec.id,
        type: rec.type,
        student: rec.student_name || 'Unknown Student', // Need to derive student name on backend or fetch here
        status: rec.status,
        match: `${rec.match_score || 0}%`,
        // Add more fields if backend provides them directly for the list
        growth: rec.growth || '+XX%', // Placeholder/mock if not from backend
        salary: rec.salary || '$XXk',
        demand: rec.demand || 'Medium',
        color: rec.color || '#3B82F6' // Placeholder/mock
      }));
      setRecommendations(fetchedRecs);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      setError(err.response?.data?.msg || "Failed to load recommendations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [counselorProfile?.id]); // Re-fetch when counselor profile changes

  const handleGenerateRecommendation = async () => {
    // This button might lead to a form where counselor selects a student
    // or triggers AI for a specific student. For now, navigate to a placeholder.
    navigate('/CounselorDashboard/recommendations/create'); // A hypothetical route for creating/generating
    // Or, if it's a simple AI trigger for _any_ assigned student:
    // Swal.fire({
    //   title: "Generate New Recommendation",
    //   input: "text",
    //   inputLabel: "Enter Student ID (e.g., of an assigned student)",
    //   inputPlaceholder: "Student ID",
    //   showCancelButton: true,
    //   inputValidator: (value) => {
    //     if (!value) {
    //       return 'You need to enter a student ID!';
    //     }
    //   }
    // }).then(async (result) => {
    //   if (result.isConfirmed) {
    //     try {
    //       setLoading(true);
    //       await CounselorService.generateRecommendationForStudent(result.value);
    //       Swal.fire('Generated!', 'Recommendation process started for student.', 'success');
    //       fetchRecommendations(); // Refresh list
    //     } catch (err: any) {
    //       Swal.fire('Error', err.response?.data?.msg || 'Failed to generate recommendation.', 'error');
    //     } finally {
    //       setLoading(false);
    //     }
    //   }
    // });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-purple-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading recommendations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchRecommendations} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">AI-Powered Recommendations</h2>
          <p className="text-slate-600 mt-1">Generate and manage personalized student guidance</p>
        </div>
        <button
          onClick={handleGenerateRecommendation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Brain className="h-4 w-4" />
          Generate New Recommendation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.length > 0 ? (
          recommendations.map((rec, index) => (
            <div key={rec.id || index} className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${
                  rec.type.includes('Career') ? 'bg-blue-100' :
                  rec.type.includes('College') ? 'bg-green-100' :
                  rec.type.includes('Skill') ? 'bg-purple-100' :
                  rec.type.includes('Academic') ? 'bg-yellow-100' :
                  rec.type.includes('Internship') ? 'bg-pink-100' :
                  'bg-indigo-100'
                }`}>
                  <Lightbulb className={`h-5 w-5 ${
                    rec.type.includes('Career') ? 'text-blue-600' :
                    rec.type.includes('College') ? 'text-green-600' :
                    rec.type.includes('Skill') ? 'text-purple-600' :
                    rec.type.includes('Academic') ? 'text-yellow-600' :
                    rec.type.includes('Internship') ? 'text-pink-600' :
                    'text-indigo-600'
                  }`} />
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  rec.status === 'Generated' ? 'bg-blue-100 text-blue-700' :
                  rec.status === 'In Review' ? 'bg-yellow-100 text-yellow-700' :
                  rec.status === 'Approved' ? 'bg-green-100 text-green-700' :
                  rec.status === 'Delivered' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {rec.status}
                </span>
              </div>
              
              <h3 className="font-semibold text-slate-800 mb-2">{rec.type}</h3>
              <p className="text-slate-600 text-sm mb-3">For: {rec.student}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-600">AI Match Score</span>
                <span className="font-bold text-green-600">{rec.match}</span>
              </div>
              
              <button 
                onClick={() => navigate(`/CounselorDashboard/recommendations/${rec.id}`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="md:col-span-3 text-center text-slate-500">No recommendations available. Generate one for your students!</p>
        )}
      </div>
    </div>
  );
};

export default CounselorRecommendationsPage;