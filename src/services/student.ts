import api from './api';

const StudentService = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (profileData: any) => api.put('/student/profile', profileData),
  submitInterests: (interestsData: any) => api.post('/student/interests', interestsData),
  getAcademicRecords: () => api.get('/student/academic_records'),
  uploadReportCard: (file: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/student/upload_report_card', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  bookCounselingSession: (bookingData: any) => api.post('/student/book_counseling_session', bookingData),
  getMyBookings: () => api.get('/student/my_bookings'),
  getRecommendationsSummary: () => api.get('/student/recommendations/summary'),
  getDetailedRecommendation: (recId: any) => api.get(`/student/recommendations/detailed/${recId}`),
  getDashboardSummary: () => api.get('/student/dashboard_summary'),
  getPerformanceAnalytics: (viewType: any) => api.get(`/student/performance_analytics?view=${viewType}`),
  getLandingPageStats: () => api.get('/student/landing_page_stats'),
};

export default StudentService;