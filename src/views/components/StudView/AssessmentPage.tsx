// src/views/components/StudView/AssessmentPage.tsx
import React, { useState, useEffect } from "react";
import { BookOpen, Clock, CheckCircle, BarChart3, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStudentDashboard } from './StudentDashboardLayout';

import AssessmentService from "../../../services/assessments";
import Swal from "sweetalert2";

interface Assessment {
  _id: string;
  name: string;
  description: string;
  type: "aptitude" | "interest" | "personality" | "quiz";
  duration_minutes: number;
  number_of_questions: number;
  status: "draft" | "published" | "archived";
}

interface AssessmentResult {
  _id: string;
  assessment_id: string;
  assessment_name: string;
  submission_date: string;
  score: number;
  total_points_possible: number;
  status: "completed" | "in_progress";
}

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { userProfile } = useStudentDashboard();
  
  const [availableAssessments, setAvailableAssessments] = useState<Assessment[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'available' | 'results'>('available');

  useEffect(() => {
    fetchAssessmentData();
  }, []);

  const fetchAssessmentData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both available assessments and results in parallel
      const [assessmentsResponse, resultsResponse] = await Promise.all([
        AssessmentService.getAvailableAssessments(),
        AssessmentService.getStudentResults()
      ]);
      
      setAvailableAssessments(assessmentsResponse.data);
      console.log("resultsResponse.data")
      console.log(resultsResponse.data)
      setAssessmentResults(resultsResponse.data);
    } catch (err: any) {
      console.error("Error fetching assessment data:", err);
      setError(err.response?.data?.msg || "Failed to load assessment data.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (assessmentId: string) => {
    navigate(`/StudentDashboard/assessments/${assessmentId}/start`);
  };

  const handleViewResults = (resultId: string) => {
    navigate(`/StudentDashboard/assessments/${resultId}/results`);
  };

  const handleRetakeAssessment = async (assessmentId: string, assessmentName: string) => {
    Swal.fire({
      title: `Retake ${assessmentName}?`,
      text: "Are you sure you want to retake this assessment? Your previous results will be kept.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, retake it!"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/StudentDashboard/assessments/${assessmentId}/start`);
      }
    });
  };

  const getAssessmentStatus = (assessmentId: string) => {
    const result = assessmentResults.find(r => r.assessment_id === assessmentId);
    return result ? 'completed' : 'not_started';
  };

  const getScorePercentage = (score: number, total: number) => {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" />
        <p className="text-lg text-slate-700">Loading assessments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={fetchAssessmentData} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="text-center mb-8">
          <BookOpen className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Career Assessments</h2>
          <p className="text-slate-600">
            Discover your career interests, aptitudes, and personality traits through comprehensive assessments
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b mb-6">
          <button
            className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'available'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('available')}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Available Assessments
          </button>
          <button
            className={`flex items-center px-6 py-3 border-b-2 transition-colors ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('results')}
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            My Results ({assessmentResults.length})
          </button>
        </div>

        {/* Available Assessments Tab */}
        {activeTab === 'available' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableAssessments.length > 0 ? (
              availableAssessments.map((assessment) => {
                const status = getAssessmentStatus(assessment._id);
                return (
                  <div key={assessment._id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-slate-800">{assessment.name}</h3>
                      {status === 'completed' && (
                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          Completed
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 mb-4 text-sm">{assessment.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {assessment.duration_minutes} min
                        </span>
                        <span>{assessment.number_of_questions} questions</span>
                      </div>
                      <span className="capitalize">{assessment.type}</span>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleStartAssessment(assessment.id)}
                        className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        {status === 'completed' ? 'Retake' : 'Start'}
                      </button>
                      {status === 'completed' && (
                        <button 
                          onClick={() => {
                            const result = assessmentResults.find(r => r.assessment_id === assessment._id);
                            if (result) handleViewResults(result._id);
                          }}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="md:col-span-2 text-center py-8">
                <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No assessments currently available.</p>
                <p className="text-sm text-slate-400 mt-1">Please check back later for new assessments.</p>
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-4">
            {assessmentResults.length > 0 ? (
              assessmentResults.map((result) => (
                <div key={result._id} className="p-6 border border-slate-200 rounded-xl hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-slate-800">{result.assessment_name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Completed
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-slate-600">Score</p>
                      <p className="text-2xl font-bold text-green-600">
                        {result.score}/{result.total_points_possible}
                      </p>
                      <p className="text-sm text-slate-500">
                        ({getScorePercentage(result.score, result.total_points_possible)}%)
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Completed on</p>
                      <p className="text-sm text-slate-800">
                        {new Date(result.submission_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewResults(result._id)}
                      className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Detailed Results 
                    </button>
                    <button 
                      onClick={() => handleRetakeAssessment(result.assessment_id, result.assessment_name)}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Retake
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">You haven't completed any assessments yet.</p>
                <p className="text-sm text-slate-400 mt-1">
                  Complete an assessment to see your results here.
                </p>
                <button 
                  onClick={() => setActiveTab('available')}
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Browse Assessments
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;