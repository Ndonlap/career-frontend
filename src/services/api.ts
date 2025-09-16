import axios from 'axios';

// --- Configuration ---
// Adjust this based on where your Flask backend is running
const API_BASE_URL = 'http://localhost:8045/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor: Attach JWT Access Token ---
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    console.log("accessToken",accessToken)
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor: Handle Token Refresh (Optional but Recommended) ---
// This is a more advanced feature. If an access token expires, the backend will return a 401.
// This interceptor can automatically try to refresh it using the refresh token.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If it's a 401 and not a refresh token request itself
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried
      
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        if (isRefreshing) {
          // If a token refresh is already in progress, queue the failed request
          return new Promise(function(resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        isRefreshing = true;

        try {
          const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
            headers: { 'Authorization': `Bearer ${refreshToken}` }
          });

          const newAccessToken = res.data.access_token;
          localStorage.setItem('access_token', newAccessToken);
          
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          processQueue(null, newAccessToken); // Resolve all queued requests
          return api(originalRequest); // Retry the original request
        } catch (refreshError) {
          // Refresh token failed or expired, log out the user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          // Redirect to login page or show a session expired message
          window.location.href = '/login'; // Example redirect
          processQueue(refreshError, null); // Reject all queued requests
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available, direct to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export default api;