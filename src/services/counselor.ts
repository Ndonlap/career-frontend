import api from './api';

const CounselorService = {
  getProfile: () => api.get('/counselor/profile'),
  getDashboardSummary: (timeframe = 'month') => api.get(`/counselor/dashboard_summary?timeframe=${timeframe}`),
  getAssignedStudents: (filters = {}) => api.get('/counselor/students', { params: filters }),
  getSingleStudentDetails: (studentId: any) => api.get(`/counselor/students/${studentId}`),
  getAppointments: (filters = {}) => api.get('/counselor/appointments', { params: filters }),
  updateAppointmentStatus: (appointmentId: any, newStatus: any) => api.put(`/counselor/appointments/${appointmentId}/status`, { status: newStatus }),
  getRecommendations: () => api.get('/counselor/recommendations'),
  generateRecommendationForStudent: (studentId: any) => api.post(`/counselor/recommendations/generate/${studentId}`),
  getQuickStats: () => api.get('/counselor/quick_stats'),
};

export default CounselorService;