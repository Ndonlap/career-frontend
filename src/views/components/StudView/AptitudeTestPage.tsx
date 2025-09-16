// src/views/components/StudView/AptitudeTestPage.tsx
import React, { useState, useEffect, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Brain, CheckCircle, XCircle, Clock, Award, Loader2, ArrowLeft, ArrowRight, Send } from "lucide-react";
import Swal from "sweetalert2";

import AssessmentService from "../../../services/assessments";

interface Question {
  _id: string;
  text: string;
  options: string[];
  category?: string;
  difficulty?: string;
  points?: number;
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

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
        const response = await AssessmentService.startAssessment(assessmentId);
        setAssessment(response.data);
        setQuestions(response.data.questions || []);
        
        // Set timer if duration is specified
        if (response.data.duration_minutes > 0) {
          const durationSeconds = response.data.duration_minutes * 60;
          setTimeRemaining(durationSeconds);
        }
      } catch (err: any) {
        console.error("Error starting assessment:", err);
        setError(err.response?.data?.msg || "Failed to load assessment.");
        Swal.fire("Error!", "Failed to load assessment.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const newTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(newTimer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(newTimer);

      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = async () => {
    if (timer) clearInterval(timer);
    setSubmitting(true);
    
    Swal.fire({
      title: "Time's up!",
      text: "Your assessment will be automatically submitted.",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK"
    });

    await submitAssessment();
  };

  const handleAnswerChange = (questionId: string, value: string, isMultipleChoice: boolean = false) => {
      console.log("questionId",questionId.toString())
    if (isMultipleChoice) {
      setStudentAnswers(prev => {
        const currentAnswers = (prev[questionId] || []) as string[];
        if (currentAnswers.includes(value)) {
          return { ...prev, [questionId.toString()]: currentAnswers.filter(item => item !== value) };
        } else {
          return { ...prev, [questionId.toString()]: [...currentAnswers, value] };
        }
      });
    } else {
      console.log("questionId",studentAnswers)
      setStudentAnswers(prev => ({ ...prev, [questionId.toString()]: value }));
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

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const submitAssessment = async () => {
    setSubmitting(true);
    try {
      console.log("studentAnswers",studentAnswers)
      const formattedAnswers: Answer[] = Object.entries(studentAnswers).map(([question_id, student_answer]) => ({
        question_id,
        student_answer
      }));

      const response = await AssessmentService.submitAssessment(assessmentId!, formattedAnswers);
      
      Swal.fire({
        title: "Assessment Submitted!",
        text: "Your answers have been successfully submitted.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "View Results"
      }).then(() => {
        navigate(`/StudentDashboard/assessments/${response.data.result_id}/results`);
        // navigate(`/StudentDashboard/assessments/${response.data.result_id}/results`);
      });
    } catch (err: any) {
      console.error("Error submitting assessment:", err);
      setError(err.response?.data?.msg || "Failed to submit assessment.");
      Swal.fire("Error!", "Failed to submit assessment. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitTest = async () => {
    const unansweredQuestions = questions.filter(q => !studentAnswers[q._id]);
    
    if (unansweredQuestions.length > 0) {
      const result = await Swal.fire({
        title: "Unanswered Questions",
        text: `You have ${unansweredQuestions.length} unanswered question(s). Are you sure you want to submit?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, submit anyway!",
        cancelButtonText: "Review questions"
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to change your answers after submission!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
      cancelButtonText: "Cancel"
    }).then(async (result) => {
      if (result.isConfirmed) {
        await submitAssessment();
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" />
          <p className="text-lg text-slate-700">Loading assessment...</p>
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
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <p className="text-lg text-slate-700 mb-4">No questions available for this assessment.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isMultipleChoice = assessment?.type === "personality" || assessment?.type === "interest";
  const selectedAnswer = studentAnswers[currentQuestion._id];
  const isOptionSelected = (optionValue: string) => {
    if (isMultipleChoice && Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(optionValue);
    }
    return selectedAnswer === optionValue;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredQuestions = Object.keys(studentAnswers).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">{assessment?.name}</h1>
              <p className="text-blue-100">{assessment?.description}</p>
            </div>
            {timeRemaining > 0 && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{answeredQuestions} of {questions.length} answered</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Navigation */}
        <div className="p-4 bg-slate-50 border-b">
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleQuestionNavigation(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  currentQuestionIndex === index
                    ? 'bg-blue-600 text-white'
                    : studentAnswers[questions[index]._id]
                    ? 'bg-green-500 text-white'
                    : 'bg-white border border-slate-300 text-slate-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Question {currentQuestionIndex + 1}
              </span>
              {currentQuestion.category && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                  {currentQuestion.category}
                </span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">{currentQuestion.text}</h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                  isOptionSelected(option)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type={isMultipleChoice ? "checkbox" : "radio"}
                  name={`question_${currentQuestion._id}`}
                  value={option}
                  checked={isOptionSelected(option)}
                  onChange={() => handleAnswerChange(currentQuestion?._id?.toString(), option, isMultipleChoice)}
                  className={`${
                    isMultipleChoice ? 'form-checkbox' : 'form-radio'
                  } h-5 w-5 text-blue-600 focus:ring-blue-500 mr-4`}
                />
                <span className="text-lg text-slate-800">{option}</span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || submitting}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 rounded-lg hover:bg-slate-300 transition disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
              Previous
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitTest}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Assessment'}
                <Send className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AptitudeTestPage;