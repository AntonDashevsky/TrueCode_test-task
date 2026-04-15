import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { authApi } from '@/shared/api';
import { useAuthStore } from './auth-store';

export function useAuth() {
  const queryClient = useQueryClient();
  const auth = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      authApi.login(payload.email, payload.password),
    onSuccess: (tokens) => {
      auth.setTokens(tokens);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: () => {
      message.error('Неверный email или пароль');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (auth.refreshToken) {
        await authApi.logout(auth.refreshToken);
      }
    },
    onSettled: () => {
      auth.clear();
      queryClient.clear();
    },
  });

  return {
    isAuthed: Boolean(auth.accessToken),
    auth,
    loginMutation,
    logoutMutation,
  };
}
