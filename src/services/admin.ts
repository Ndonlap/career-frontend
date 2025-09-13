import api from './api';

const AdminService = {
  getDashboardOverview: () => api.get('/admin/dashboard_overview'),

  // User Management
  getAllUsers: (filters = {}) => api.get('/admin/users', { params: filters }),
  createUser: (userData: any) => api.post('/admin/users', userData),
  getUserDetails: (userId: any) => api.get(`/admin/users/${userId}`),
  updateUser: (userId: any, userData: any) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId: any) => api.delete(`/admin/users/${userId}`),
  getUserStats: () => api.get('/admin/user_stats'),

  // Course Management
  getAllCourses: () => api.get('/admin/courses'),
  createCourse: (courseData: any) => api.post('/admin/courses', courseData),
  updateCourse: (courseId: any, courseData: any) => api.put(`/admin/courses/${courseId}`, courseData),
  deleteCourse: (courseId: any) => api.delete(`/admin/courses/${courseId}`),
  getCourseAnalytics: () => api.get('/admin/course_analytics'),

  // Career Management
  getAllCareers: () => api.get('/admin/careers'),
  createCareer: (careerData: any) => api.post('/admin/careers', careerData),
  updateCareer: (careerId: any, careerData: any) => api.put(`/admin/careers/${careerId}`, careerData),
  deleteCareer: (careerId: any) => api.delete(`/admin/careers/${careerId}`),
  getCareerAnalytics: () => api.get('/admin/career_analytics'),
  getCareerTrends: () => api.get('/admin/career_trends'),

  // Assessment Management (Admin part)
  createAssessment: (assessmentData: any) => api.post('/assessments/admin/assessments', assessmentData),
  getAllAssessments: () => api.get('/assessments/admin/assessments'),
  getAssessmentDetails: (assessmentId: any) => api.get(`/assessments/admin/assessments/${assessmentId}`),
  updateAssessment: (assessmentId: any, assessmentData: any) => api.put(`/assessments/admin/assessments/${assessmentId}`, assessmentData),
  deleteAssessment: (assessmentId: any) => api.delete(`/assessments/admin/assessments/${assessmentId}`),

  // System Analytics & Settings
  getSystemHealthMetrics: () => api.get('/admin/system_health_metrics'),
  getSystemUsageDistribution: () => api.get('/admin/system_usage_distribution'),
  getUserEngagementTrends: () => api.get('/admin/user_engagement_trends'),
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (settingsData: any) => api.put('/admin/settings', settingsData),

  // Public Content Management (Admin part)
  createPublicContent: (contentData: any) => api.post('/admin/content', contentData),
  updatePublicContent: (itemId: any, contentData: any) => api.put(`/admin/content/${itemId}`, contentData),
  // No direct delete for public content shown in frontend, but could be added
};

export default AdminService;