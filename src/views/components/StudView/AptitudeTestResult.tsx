// src/views/components/StudView/AptitudeTestResult.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Award, CheckCircle, XCircle, Brain, FileText } from "lucide-react";
import { useStudentDashboard } from './StudentDashboardLayout'; // To trigger dashboard refresh if needed

import AssessmentService from "../../../services/assessments";

const AptitudeTestResult: React.FC = () => {
  const navigate = useNavigate();
  const { assessmentId } = useParams<{ assessmentId: string }>(); // The assessment definition ID
  const location = useLocation(); // To get query params
  const queryParams = new URLSearchParams(location.search);
  const resultId = queryParams.get('resultId'); // The ID of the submitted result

  const { fetchDashboardData } = useStudentDashboard(); // To re-fetch badges/counts

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!resultId) {
        setError("Assessment Result ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await AssessmentService.getSingleStudentResult(resultId);
        setTestResult(response.data);
        
        // Optionally re-fetch dashboard data to update assessment badges, etc.
        fetchDashboardData();

      } catch (err: any) {
        console.error("Error fetching assessment result:", err);
        setError(err.response?.data?.msg || "Failed to load assessment result.");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, fetchDashboardData]); // Depend on resultId and fetchDashboardData

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-700">Loading assessment result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={() => navigate('/StudentDashboard/assessments')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">View Assessments</button>
      </div>
    );
  }

  if (!testResult) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-slate-50">
              <p className="text-lg text-slate-700">No result data found.</p>
              <button onClick={() => navigate('/StudentDashboard/assessments')} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">View Assessments</button>
          </div>
      );
  }

  // Determine if it's a scored test
  const isScored = testResult.score !== undefined && testResult.total_points_possible !== undefined;

  return (
    <div className="p-8 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center max-w-2xl w-full">
        <Award className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Assessment Completed!</h2>
        <p className="text-slate-600 text-lg mb-4">Thank you for completing the {testResult.assessment_name || "assessment"}.</p>
        
        {isScored && (
          <p className="text-2xl font-semibold text-blue-700 mb-2">
            Your Score: {testResult.score} / {testResult.total_points_possible}
          </p>
        )}

        {testResult.insights && Object.keys(testResult.insights).length > 0 && (
          <div className="mt-6 text-left">
            <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" /> Key Insights
            </h3>
            {testResult.insights.strengths && testResult.insights.strengths.length > 0 && (
              <p className="text-green-600 font-medium flex items-center gap-2 mb-2">
                <CheckCircle size={18} /> Strengths: {testResult.insights.strengths.join(', ')}
              </p>
            )}
            {testResult.insights.weaknesses && testResult.insights.weaknesses.length > 0 && (
              <p className="text-red-600 font-medium flex items-center gap-2 mb-2">
                <XCircle size={18} /> Weaknesses: {testResult.insights.weaknesses.join(', ')}
              </p>
            )}
            {testResult.insights.career_suggestions && testResult.insights.career_suggestions.length > 0 && (
              <div className="mt-4">
                  <p className="font-semibold text-slate-700">Recommended Careers:</p>
                  <ul className="list-disc list-inside text-slate-600 ml-4">
                      {testResult.insights.career_suggestions.map((c: any, idx: number) => (
                          <li key={idx}>{c.title} ({c.match})</li>
                      ))}
                  </ul>
              </div>
            )}
             {testResult.insights.skill_development_areas && testResult.insights.skill_development_areas.length > 0 && (
              <div className="mt-4">
                  <p className="font-semibold text-slate-700">Skill Development Areas:</p>
                  <ul className="list-disc list-inside text-slate-600 ml-4">
                      {testResult.insights.skill_development_areas.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                      ))}
                  </ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed questions/answers if available (for feedback) */}
        {testResult.detailed_questions && testResult.detailed_questions.length > 0 && (
            <div className="mt-8 text-left">
                <h3 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" /> Detailed Feedback
                </h3>
                {testResult.detailed_questions.map((q: any, idx: number) => (
                    <div key={q.id || idx} className="p-4 mb-4 border border-slate-100 rounded-lg">
                        <p className="font-medium text-slate-800 mb-2">Q{idx + 1}: {q.text}</p>
                        <p className="text-sm text-slate-700 mb-1">Your Answer: <span className="font-semibold">{Array.isArray(q.student_answer) ? q.student_answer.join(', ') : q.student_answer}</span></p>
                        {q.correct_answer && (
                            <p className="text-sm text-slate-700 mb-1">Correct Answer: <span className="font-semibold">{Array.isArray(q.correct_answer) ? q.correct_answer.join(', ') : q.correct_answer}</span></p>
                        )}
                        <p className={`text-sm font-semibold ${q.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                            {q.is_correct ? <CheckCircle size={14} className="inline mr-1" /> : <XCircle size={14} className="inline mr-1" />}
                            {q.is_correct ? 'Correct' : 'Incorrect'}
                        </p>
                        {q.explanation && (
                            <p className="text-xs text-slate-500 mt-2">Explanation: {q.explanation}</p>
                        )}
                    </div>
                ))}
            </div>
        )}


        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/StudentDashboard/assessments')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Other Assessments
          </button>
          <button
            onClick={() => navigate('/StudentDashboard/recommendations')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            See My Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestResult;