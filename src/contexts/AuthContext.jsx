import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authAPI } from '../api/endpoints';
import { tokenManager } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initializeAuth = () => {
      const refreshToken = tokenManager.getRefreshToken();
      setIsInitialized(true);
      
      if (!refreshToken) {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      tokenManager.setAccessToken(data.accessToken);
      tokenManager.setRefreshToken(data.refreshToken);
      queryClient.setQueryData(['currentUser'], data.user);
      navigate('/dashboard');
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      tokenManager.clearTokens();
      queryClient.clear();
      navigate('/login');
    },
  });

  // Get current user query
  const { data: user, isLoading: isLoadingUser, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authAPI.getCurrentUser,
    enabled: !!tokenManager.getAccessToken() || !!tokenManager.getRefreshToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // If user query fails (token expired), clear tokens and redirect
  useEffect(() => {
    if (error && (tokenManager.getAccessToken() || tokenManager.getRefreshToken())) {
      tokenManager.clearTokens();
      queryClient.clear();
      navigate('/login');
    }
  }, [error, navigate, queryClient]);

  const login = async (credentials) => {
    return loginMutation.mutateAsync(credentials);
  };

  const logout = async () => {
    return logoutMutation.mutateAsync();
  };

  const isAuthenticated = !!user || !!tokenManager.getRefreshToken();

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    isLoading: !isInitialized || isLoadingUser,
    isLoginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
