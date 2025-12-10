import apiClient, { tokenManager } from './axios';

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  logout: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken });
    }
    tokenManager.clearTokens();
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },
};

// User API
export const userAPI = {
  getStats: async () => {
    const response = await apiClient.get('/user/stats');
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/dashboard');
    return response.data;
  },
};

export { tokenManager };
