import api from './api';

const AuthService = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  refreshAccessToken: (refreshToken: any) => api.post('/auth/refresh', {}, {
    headers: { 'Authorization': `Bearer ${refreshToken}` }
  }),
  getProfile: () => api.get('/auth/me'),

  // Helper to store/retrieve tokens
  setTokens: (accessToken: any, refreshToken: any, role: any) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_role', role); // Store role for client-side routing
  },
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
  },
  getAccessToken: () => localStorage.getItem('access_token'),
  getRefreshToken: () => localStorage.getItem('refresh_token'),
  getUserRole: () => localStorage.getItem('user_role'),
};

export default AuthService;