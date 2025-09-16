import api from './api';

const AdminService = {
  getDashboardOverview: () => api.get('/admin/dashboard_overview'),

  // User Management
  getAllUsers: (filters = {}) => api.get('/admin/users', { params: filters }),
  createUser: (userData: any) => api.post('/admin/users', userData),
  getUserDetails: (userId: any) => api.get(`/admin/users/${userId}`),
  updateUser: (userId: any, userData: any) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId: any) => api.delete(`/admin/users/${userId}`),
  suspendUser: (userId: any) => api.post(`/admin/users/${userId}/suspend`),
  reactivateUser: (userId: any) => api.post(`/admin/users/${userId}/reactivate`),
  changeUserRole: (userId: any, roleData: any) => api.post(`/admin/users/${userId}/change_role`, roleData),
  bulkUserAction: (actionData: any) => api.post('/admin/users/bulk_action', actionData),
  exportUsers: (filters = {}) => api.get('/admin/users/export', { params: filters }),
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

  // System Analytics & Settings
  getSystemHealthMetrics: () => api.get('/admin/system_health_metrics'),
  getSystemUsageDistribution: () => api.get('/admin/system_usage_distribution'),
  getUserEngagementTrends: () => api.get('/admin/user_engagement_trends'),
  getSystemSettings: () => api.get('/admin/settings'),
  updateSystemSettings: (settingsData: any) => api.put('/admin/settings', settingsData),

  // Assessment Management (Admin part)
  createAssessment: (assessmentData: any) => api.post('/assessments/admin/assessments', assessmentData),
  getAllAssessments: () => api.get('/assessments/admin/assessments'),
  getAssessmentDetails: (assessmentId: any) => api.get(`/assessments/admin/assessments/${assessmentId}`),
  updateAssessment: (assessmentId: any, assessmentData: any) => api.put(`/assessments/admin/assessments/${assessmentId}`, assessmentData),
  deleteAssessment: (assessmentId: any) => api.delete(`/assessments/admin/assessments/${assessmentId}`),

  // Public Content Management (Admin part)
  createPublicContent: (contentData: any) => api.post('/admin/content', contentData),
  updatePublicContent: (itemId: any, contentData: any) => api.put(`/admin/content/${itemId}`, contentData),

  // Content Management Services
  getContent: (contentType: string) => api.get(`/admin/content/${contentType}`),
  updateContent: (contentType: string, contentData: any) => api.put(`/admin/content/${contentType}`, contentData),
  uploadContentFile: (contentType: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/admin/content/${contentType}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  syncContentToDB: (contentType: string) => api.post(`/admin/content/${contentType}/sync-to-db`),
  exportContent: (contentType: string) => api.get(`/admin/content/${contentType}/export`),

  // Download content as JSON file
  downloadContentTemplate: (contentType: string) => {
    return api.get(`/admin/content/${contentType}`, {
      responseType: 'blob'
    }).then(response => {
      // Create a blob from the response
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${contentType}_cameroon.json`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response;
    });
  },

  // Academic Records Services
  getAllAcademicRecords: (filters = {}) => api.get('/admin/academic-records', { params: filters }),
  getAcademicRecord: (recordId: string) => api.get(`/admin/academic-records/${recordId}`),
  downloadReportCard: (recordId: string) => api.get(`/admin/academic-records/${recordId}/download`, { responseType: 'blob' }),
  validateRecord: (recordId: string, notes: string) => api.post(`/admin/academic-records/${recordId}/validate`, { notes }),
  rejectRecord: (recordId: string, notes: string) => api.post(`/admin/academic-records/${recordId}/reject`, { notes }),
  deleteAcademicRecord: (recordId: string) => api.delete(`/admin/academic-records/${recordId}`),
  getAcademicRecordsStats: () => api.get('/admin/academic-records/stats'),

};

export default AdminService;