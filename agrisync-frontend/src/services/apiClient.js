import axios from 'axios';

// --- Configuration ---
// Replace with your actual backend API URL
export const API_BASE_URL = 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've tried to refresh for this request
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token, logout or redirect to login
          console.error("No refresh token available.");
          window.location.href = '/#/login';
          return Promise.reject(error);
        }

        // Use a separate axios instance for token refresh to avoid interceptor loop
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refreshToken });
        
        const newAccessToken = refreshResponse.data.access;
        localStorage.setItem('accessToken', newAccessToken);
        
        // Update the Authorization header for the original request and for future requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        return apiClient(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Logout user if refresh fails
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/#/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;