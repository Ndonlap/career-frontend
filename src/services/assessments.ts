import api from './api';

const AssessmentService = {
  // Student-facing routes
  getAvailableAssessments: () => api.get('/assessments/available'),
  startAssessment: (assessmentId: any, numQuestions = 0) => {
    // numQuestions will be 0 if not provided, meaning all questions
    return api.get(`/assessments/${assessmentId}/start${numQuestions > 0 ? `?num_questions=${numQuestions}` : ''}`);
  },
  submitAssessment: (assessmentId: any, answers: any) => api.post(`/assessments/${assessmentId}/submit`, { answers }),
  getStudentResults: () => api.get('/assessments/student/results'),
  getSingleStudentResult: (resultId: any) => api.get(`/assessments/student/results/${resultId}`),

  // Admin-facing routes (already in AdminService, but good to note here for completeness)
  // createAssessment: (assessmentData) => api.post('/assessments/admin/assessments', assessmentData),
  // getAllAssessments: () => api.get('/assessments/admin/assessments'),
  // getAssessmentDetails: (assessmentId) => api.get(`/assessments/admin/assessments/${assessmentId}`),
  // updateAssessment: (assessmentId, assessmentData) => api.put(`/assessments/admin/assessments/${assessmentId}`, assessmentData),
  // deleteAssessment: (assessmentId) => api.delete(`/assessments/admin/assessments/${assessmentId}`),
};

export default AssessmentService;