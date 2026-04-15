import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { profileApi } from '@/shared/api';
import type { Profile } from '@/shared/api';

export function useProfile(enabled: boolean) {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.me,
    enabled,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: Partial<Profile>) => profileApi.update(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      message.success('Профиль обновлён');
    },
    onError: () => {
      message.error('Ошибка при обновлении профиля');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      message.success('Аватар обновлён');
    },
    onError: () => {
      message.error('Ошибка при загрузке аватара');
    },
  });

  return {
    profileQuery,
    updateProfileMutation,
    uploadAvatarMutation,
  };
}
