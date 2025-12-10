import { mockAPI } from './mockAPI';

// Token management for mock mode
const mockTokenManager = {
  getAccessToken: () => localStorage.getItem('mockAccessToken'),
  setAccessToken: (token) => localStorage.setItem('mockAccessToken', token),
  getRefreshToken: () => localStorage.getItem('mockRefreshToken'),
  setRefreshToken: (token) => localStorage.setItem('mockRefreshToken', token),
  clearTokens: () => {
    localStorage.removeItem('mockAccessToken');
    localStorage.removeItem('mockRefreshToken');
  },
};

export { mockTokenManager as tokenManager };

// Authentication API
export const authAPI = {
  login: async (credentials) => {
    const data = await mockAPI.login(credentials);
    mockTokenManager.setAccessToken(data.accessToken);
    mockTokenManager.setRefreshToken(data.refreshToken);
    return data;
  },

  logout: async () => {
    await mockAPI.logout();
    mockTokenManager.clearTokens();
  },

  getCurrentUser: async () => {
    return await mockAPI.getCurrentUser();
  },

  refreshToken: async (refreshToken) => {
    // Mock refresh - just return same token
    return { accessToken: refreshToken };
  },
};

// User API
export const userAPI = {
  getStats: async () => {
    return await mockAPI.getStats();
  },

  getDashboard: async () => {
    return await mockAPI.getDashboard();
  },
};
