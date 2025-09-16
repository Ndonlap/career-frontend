// src/views/components/StudView/AptitudeTestPage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brain, CheckCircle, XCircle, Clock, Award } from "lucide-react";
import Swal from "sweetalert2";

import AssessmentService from "../../../services/assessments";

interface Question {
  id: string;
  text: string;
  options: string[];
  category?: string;
  difficulty?: string;
}

interface Answer {
  question_id: string;
  student_answer: string | string[];
}

const AptitudeTestPage: React.FC = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!assessmentId) {
        setError("Assessment ID is missing.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Fetch questions for the specific assessment
        const response = await AssessmentService.startAssessment(assessmentId, 0); // 0 to get all available questions from that assessment
        setAssessment(response.data);
        setQuestions(response.data.questions);
      } catch (err: any) {
        console.error("Error starting assessment:", err);
        setError(err.response?.data?.msg || "Failed to load assessment.");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  const handleAnswerChange = (questionId: string, value: string, isMultipleChoice: boolean) => {
    if (isMultipleChoice) {
      setStudentAnswers(prev => {
        const currentAnswers = (prev[questionId] || []) as string[];
        if (currentAnswers.includes(value)) {
          return { ...prev, [questionId]: currentAnswers.filter(item => item !== value) };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, value] };
        }
      });
    } else {
      setStudentAnswers(prev => ({ ...prev, [questionId]: value }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitTest = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to change your answers after submission!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        setError(null);
        try {
          const formattedAnswers: Answer[] = questions.map(q => ({
            question_id: q.id,
            student_answer: studentAnswers[q.id] || "" // Send empty string if no answer
          }));

          const response = await AssessmentService.submitAssessment(assessmentId!, formattedAnswers);
          // Redirect to the result page with the new result_id
          navigate(`/StudentDashboard/assessments/${assessmentId}/result?resultId=${response.data.result_id}`);
        } catch (err: any) {
          console.error("Error submitting assessment:", err);
          setError(err.response?.data?.msg || "Failed to submit assessment.");
          Swal.fire("Error!", "Failed to submit assessment.", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-slate-700">Loading assessment...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-lg text-red-600">Error: {error}</p>
        <button onClick={() => navigate(-1)} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Go Back</button>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <p className="text-lg text-slate-700">No questions found for this assessment.</p>
            <button onClick={() => navigate(-1)} className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md">Go Back</button>
        </div>
    );
  }

  // Determine if it's a multiple choice question (checkboxes) vs single choice (radio)
  // This heuristic can be improved by backend providing `question_type`
  const isMultipleChoice = assessment?.type === "personality" || assessment?.type === "interest";
  
  const selectedAnswerForQuestion = studentAnswers[currentQuestion.id];
  const isOptionSelected = (optionValue: string) => {
    if (isMultipleChoice && Array.isArray(selectedAnswerForQuestion)) {
      return selectedAnswerForQuestion.includes(optionValue);
    }
    return selectedAnswerForQuestion === optionValue;
  };


  return (
    <div className="p-8 min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 flex items-center gap-3">
          <Brain className="h-8 w-8 text-purple-600" /> {assessment?.name || "Assessment"}
        </h2>
        <p className="text-slate-600 mb-8">{assessment?.description}</p>

        <div className="mb-8">
          <p className="text-lg font-semibold text-slate-700 mb-4">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-xl font-medium text-slate-900">{currentQuestion.text}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <label key={index} className="flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type={isMultipleChoice ? "checkbox" : "radio"}
                name={`question_${currentQuestion.id}`}
                value={option}
                checked={isOptionSelected(option)}
                onChange={() => handleAnswerChange(currentQuestion.id, option, isMultipleChoice)}
                className={`form-${isMultipleChoice ? "checkbox" : "radio"} h-5 w-5 text-blue-600 focus:ring-blue-500 mr-3`}
              />
              <span className="text-lg text-slate-800">{option}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0 || loading}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmitTest}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Test'}
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestPage;