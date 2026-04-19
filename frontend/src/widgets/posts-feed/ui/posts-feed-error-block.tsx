import { memo } from 'react';
import { QueryErrorPanel } from '@/shared/ui/query-error-panel';

type PostsFeedErrorBlockProps = {
  onRetry: () => void;
  retryLoading: boolean;
};

export const PostsFeedErrorBlock = memo(function PostsFeedErrorBlock({
  onRetry,
  retryLoading,
}: PostsFeedErrorBlockProps) {
  return (
    <QueryErrorPanel
      title="Лента не загружена"
      subTitle="Сервер не ответил. Проверьте, что бэкенд запущен."
      onRetry={onRetry}
      retryLoading={retryLoading}
    />
  );
});
