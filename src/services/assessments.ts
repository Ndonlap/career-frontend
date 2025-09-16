import api from './api';

const AssessmentService = {
  // ===== STUDENT-FACING ROUTES =====

  // Get available assessments for students (published only)
  getAvailableAssessments: () => api.get('/assessments/available'),

  // Start an assessment (gets questions without answers)
  startAssessment: (assessmentId: string, numQuestions: number = 0) => {
    const params = numQuestions > 0 ? { num_questions: numQuestions } : {};
    return api.get(`/assessments/${assessmentId}/start`, { params });
  },

  // Submit assessment answers and get results
  submitAssessment: (assessmentId: string, answers: any[]) =>
    api.post(`/assessments/${assessmentId}/submit`, { answers }),

  // Get all assessment results for the current student
  getStudentResults: () => api.get('/assessments/student/results'),

  // Get detailed result for a specific assessment
  getSingleStudentResult: (resultId: string) =>
    api.get(`/assessments/student/results/${resultId}`),

  // Add to AssessmentService
  getStudentResultsSummary: () => api.get('/assessments/student/results/summary'),
  getAssessmentStatus: (assessmentId: string) => api.get(`/assessments/student/assessment/${assessmentId}/status`),

  // ===== ADMIN-FACING ROUTES =====

  // Create a new assessment
  createAssessment: (assessmentData: any) =>
    api.post('/assessments/admin/assessments', assessmentData),

  // Get all assessments (admin view)
  getAllAssessments: (filters: any = {}) =>
    api.get('/assessments/admin/assessments', { params: filters }),

  // Get detailed assessment info including questions and answers
  getAssessmentDetails: (assessmentId: string) =>
    api.get(`/assessments/admin/assessments/${assessmentId}`),

  // Update an existing assessment
  updateAssessment: (assessmentId: string, assessmentData: any) =>
    api.put(`/assessments/admin/assessments/${assessmentId}`, assessmentData),

  // Delete an assessment
  deleteAssessment: (assessmentId: string) =>
    api.delete(`/assessments/admin/assessments/${assessmentId}`),

  // ===== NEW ADMIN FUNCTIONALITY =====

  // Get assessment analytics and statistics
  getAssessmentAnalytics: (assessmentId: string) =>
    api.get(`/assessments/admin/assessments/${assessmentId}/analytics`),

  // Bulk assessment operations (publish/unpublish/delete)
  bulkAssessmentAction: (assessmentIds: string[], action: string) =>
    api.post('/assessments/admin/assessments/bulk', {
      assessment_ids: assessmentIds,
      action: action
    }),

  // Upload question image/file
  uploadQuestionImage: (assessmentId: string, questionId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('question_id', questionId);

    return api.post(`/assessments/admin/assessments/${assessmentId}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // ===== UTILITY FUNCTIONS =====

  // Download assessment results as CSV/Excel
  exportAssessmentResults: (assessmentId: string, format: string = 'csv') =>
    api.get(`/assessments/admin/assessments/${assessmentId}/export`, {
      params: { format },
      responseType: 'blob'
    }),

  // Get assessment attempts by student
  getStudentAttempts: (assessmentId: string, studentId: string) =>
    api.get(`/assessments/admin/assessments/${assessmentId}/students/${studentId}/attempts`),

  // Regrade assessment (admin can force regrade if needed)
  regradeAssessment: (resultId: string) =>
    api.post(`/assessments/admin/results/${resultId}/regrade`)
};

// Types for better TypeScript support
export interface Assessment {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  type: 'aptitude' | 'interest' | 'personality' | 'quiz';
  duration_minutes: number;
  number_of_questions: number;
  status: 'draft' | 'published' | 'archived';
  questions: AssessmentQuestion[];
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AssessmentQuestion {
  _id?: string;
  id?: string;
  text: string;
  options: string[];
  correct_answer?: string | string[];
  points?: number;
  category?: string;
  image_url?: string;
  explanation?: string;
}

export interface AssessmentResult {
  _id?: string;
  id?: string;
  student_id: string;
  assessment_id: string;
  assessment_name?: string;
  submission_date: string;
  score: number;
  total_points_possible: number;
  answers: AssessmentAnswer[];
  insights: AssessmentInsights;
  created_at?: string;
}

export interface AssessmentAnswer {
  question_id: string;
  student_answer: string | string[];
  is_correct: boolean;
  points_earned: number;
}

export interface AssessmentInsights {
  strengths: string[];
  weaknesses: string[];
  career_suggestions: CareerSuggestion[];
  skill_development_areas: string[];
}

export interface CareerSuggestion {
  title: string;
  match: 'High' | 'Medium' | 'Low';
  reason?: string;
}

export interface AssessmentAnalytics {
  overall_stats: {
    total_submissions: number;
    average_score: number;
    max_score: number;
    min_score: number;
  };
  question_stats: Array<{
    question_id: string;
    correct_count: number;
    total_attempts: number;
    average_points: number;
    difficulty_index?: number;
  }>;
}

export default AssessmentService;