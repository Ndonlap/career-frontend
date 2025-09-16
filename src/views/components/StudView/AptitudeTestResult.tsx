// src/views/components/StudView/AptitudeTestResult.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Award, CheckCircle, XCircle, Brain, FileText, Download, BarChart3, Home, RefreshCw, Loader2 } from "lucide-react";
import { useStudentDashboard } from './StudentDashboardLayout';

import AssessmentService from "../../../services/assessments";
import Swal from "sweetalert2";

interface AssessmentResult {
  _id: string;
  assessment_id: string;
  assessment_name: string;
  submission_date: string;
  score: number;
  total_points_possible: number;
  answers: Array<{
    question_id: string;
    question_text: string;
    student_answer: string | string[];
    is_correct: boolean;
    points_earned: number;
    max_points: number;
  }>;
  insights: {
    strengths: string[];
    weaknesses: string[];
    career_suggestions: Array<{
      title: string;
      match: string;
      reason?: string;
    }>;
    skill_development_areas: string[];
  };
  detailed_questions?: Array<{
    _id: string;
    text: string;
    options: string[];
    correct_answer: string | string[];
    student_answer: string | string[];
    is_correct: boolean;
    explanation?: string;
    category?: string;
  }>;
}

const AptitudeTestResult: React.FC = () => {
  const navigate = useNavigate();
  const { resultId } = useParams<{ resultId: string }>(); // Get resultId from route params
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fromAssessment = queryParams.get('fromAssessment');

  const { fetchDashboardData } = useStudentDashboard();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<AssessmentResult | null>(null);
  const [downloading, setDownloading] = useState(false);

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
        fetchDashboardData();
      } catch (err: any) {
        console.error("Error fetching assessment result:", err);
        setError(err.response?.data?.msg || "Failed to load assessment result.");
        Swal.fire("Error!", "Failed to load assessment result.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId, fetchDashboardData]);

  const handleDownloadPDF = async () => {
    if (!testResult) return;
    
    setDownloading(true);
    try {
      // This would call a backend endpoint to generate a PDF
      // For now, we'll create a simple client-side PDF download
      const printableContent = document.getElementById('result-content');
      if (printableContent) {
        const originalStyles = document.querySelectorAll('style, link[rel="stylesheet"]');
        originalStyles.forEach(style => (style as HTMLElement).setAttribute('media', 'print'));
        
        window.print();
        
        // Restore styles after printing
        setTimeout(() => {
          originalStyles.forEach(style => (style as HTMLElement).removeAttribute('media'));
        }, 500);
      }
    } catch (err: any) {
      console.error("Error downloading result:", err);
      Swal.fire("Error!", "Failed to download result.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handleRetakeAssessment = () => {
    if (!testResult) return;
    
    Swal.fire({
      title: "Retake Assessment?",
      text: "Are you sure you want to retake this assessment? Your previous results will be kept.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, retake it!"
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/StudentDashboard/assessments/${testResult.assessment_id}/start`);
      }
    });
  };

  const calculateScorePercentage = () => {
    if (!testResult || testResult.total_points_possible === 0) return 0;
    return Math.round((testResult.score / testResult.total_points_possible) * 100);
  };

  const getPerformanceMessage = () => {
    const percentage = calculateScorePercentage();
    if (percentage >= 90) return "Excellent! Outstanding performance!";
    if (percentage >= 80) return "Great job! Strong performance!";
    if (percentage >= 70) return "Good work! Solid performance!";
    if (percentage >= 60) return "Not bad! Room for improvement.";
    return "Keep practicing! You'll improve with more effort.";
  };

  const getPerformanceColor = () => {
    const percentage = calculateScorePercentage();
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700">Loading assessment result...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-red-600 mb-4">Error: {error}</p>
          <button 
            onClick={() => navigate('/StudentDashboard/assessments')} 
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            View Assessments
          </button>
        </div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg text-slate-700 mb-4">No result data found.</p>
          <button 
            onClick={() => navigate('/StudentDashboard/assessments')} 
            className="px-6 py-2 bg-blue-500 text-white rounded-md"
          >
            View Assessments
          </button>
        </div>
      </div>
    );
  }

  const scorePercentage = calculateScorePercentage();
  const performanceMessage = getPerformanceMessage();
  const performanceColor = getPerformanceColor();

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div id="result-content" className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Assessment Completed!</h1>
          <p className="text-slate-600 text-lg">
            You completed {testResult.assessment_name} on{" "}
            {new Date(testResult.submission_date).toLocaleDateString()}
          </p>
        </div>

        {/* Score Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 text-center">
          <div className="flex justify-center items-baseline mb-4">
            <span className="text-4xl font-bold text-blue-600 mr-2">{testResult.score}</span>
            <span className="text-2xl text-slate-600">/ {testResult.total_points_possible}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${scorePercentage}%` }}
            />
          </div>
          <p className={`text-xl font-semibold ${performanceColor} mb-2`}>
            {scorePercentage}% - {performanceMessage}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {downloading ? <Loader2 className="animate-spin h-5 w-5" /> : <Download className="h-5 w-5" />}
            Download PDF
          </button>
          <button
            onClick={handleRetakeAssessment}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <RefreshCw className="h-5 w-5" />
            Retake Assessment
          </button>
          <button
            onClick={() => navigate('/StudentDashboard/assessments')}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <Home className="h-5 w-5" />
            Back to Assessments
          </button>
        </div>

        {/* Insights */}
        {testResult.insights && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6 text-purple-600" /> Key Insights
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              {testResult.insights.strengths && testResult.insights.strengths.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" /> Strengths
                  </h3>
                  <ul className="list-disc list-inside text-green-700 ml-4">
                    {testResult.insights.strengths.map((strength, idx) => (
                      <li key={idx}>{strength}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {testResult.insights.weaknesses && testResult.insights.weaknesses.length > 0 && (
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                    <XCircle className="h-5 w-5" /> Areas for Improvement
                  </h3>
                  <ul className="list-disc list-inside text-red-700 ml-4">
                    {testResult.insights.weaknesses.map((weakness, idx) => (
                      <li key={idx}>{weakness}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Career Suggestions */}
            {testResult.insights.career_suggestions && testResult.insights.career_suggestions.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" /> Recommended Career Paths
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {testResult.insights.career_suggestions.map((career, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border">
                      <h4 className="font-semibold text-slate-800">{career.title}</h4>
                      <span className={`text-sm ${
                        career.match === 'High' ? 'text-green-600' :
                        career.match === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {career.match} Match
                      </span>
                      {career.reason && <p className="text-sm text-slate-600 mt-1">{career.reason}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Development */}
            {testResult.insights.skill_development_areas && testResult.insights.skill_development_areas.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">Skill Development Areas</h3>
                <ul className="list-disc list-inside text-yellow-700 ml-4">
                  {testResult.insights.skill_development_areas.map((skill, idx) => (
                    <li key={idx}>{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Detailed Questions */}
        {testResult.detailed_questions && testResult.detailed_questions.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-600" /> Detailed Feedback
            </h2>
            <div className="space-y-4">
              {testResult.detailed_questions.map((q, idx) => (
                <div key={q._id || idx} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-slate-800">Q{idx + 1}: {q.text}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      q.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {q.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-600 font-medium">Your Answer:</p>
                      <p className="font-semibold">
                        {Array.isArray(q.student_answer) ? q.student_answer.join(', ') : q.student_answer}
                      </p>
                    </div>
                    
                    {q.correct_answer && (
                      <div>
                        <p className="text-slate-600 font-medium">Correct Answer:</p>
                        <p className="font-semibold">
                          {Array.isArray(q.correct_answer) ? q.correct_answer.join(', ') : q.correct_answer}
                        </p>
                      </div>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 p-3 bg-slate-50 rounded">
                      <p className="text-sm text-slate-600 font-medium">Explanation:</p>
                      <p className="text-slate-700">{q.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AptitudeTestResult;