import { useQuery } from '@tanstack/react-query';
import { userAPI } from '../api/endpoints';

export const useUserStats = () => {
  return useQuery({
    queryKey: ['userStats'],
    queryFn: userAPI.getStats,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: userAPI.getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
