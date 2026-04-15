import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { postsApi } from '@/shared/api';

type SortType = 'newest' | 'oldest';

export function usePosts(params: {
  enabled: boolean;
  page: number;
  sort: SortType;
}) {
  const queryClient = useQueryClient();

  const postsQuery = useQuery({
    queryKey: ['posts', params.page, params.sort],
    queryFn: () => postsApi.list(params.page, 5, params.sort),
    enabled: params.enabled,
  });

  const createPostMutation = useMutation({
    mutationFn: (payload: { text: string; images: File[] }) =>
      postsApi.create(payload.text, payload.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      message.success('Пост создан');
    },
    onError: () => {
      message.error('Ошибка при создании поста');
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => postsApi.remove(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      message.success('Пост удалён');
    },
    onError: () => {
      message.error('Ошибка при удалении поста');
    },
  });

  const editPostMutation = useMutation({
    mutationFn: (payload: {
      id: string;
      data: { text?: string; removeImageIds?: string[]; images?: File[] };
    }) => postsApi.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      message.success('Пост обновлён');
    },
    onError: () => {
      message.error('Ошибка при обновлении поста');
    },
  });

  return {
    postsQuery,
    createPostMutation,
    deletePostMutation,
    editPostMutation,
  };
}
