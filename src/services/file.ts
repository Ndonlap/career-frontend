import api from './api';

const FileService = {
  uploadFile: (file: string | Blob, userId: any, fileType = 'general') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('file_type', fileType); // Optional: specify type on backend
    return api.post(`/files/upload/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  // You might have specific endpoints for report cards, profile pics etc.
  uploadReportCard: (file: string | Blob, studentId: any) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/student/upload_report_card`, formData, { // Using student-specific endpoint
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export default FileService;