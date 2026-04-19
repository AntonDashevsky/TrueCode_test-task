import { memo } from 'react';
import { InlineLoading } from '@/shared/ui/inline-loading';
import { QueryErrorPanel } from '@/shared/ui/query-error-panel';

type ProfileCardFetchStateProps = {
  active: boolean;
  isInitialLoading: boolean;
  loadError: boolean;
  loadRetrying: boolean;
  onLoadRetry?: () => void;
};

export const ProfileCardFetchState = memo(function ProfileCardFetchState({
  active,
  isInitialLoading,
  loadError,
  loadRetrying,
  onLoadRetry,
}: ProfileCardFetchStateProps) {
  if (!active) return null;
  if (isInitialLoading) {
    return <InlineLoading tip="Загрузка профиля…" minHeight={220} />;
  }
  if (loadError) {
    return (
      <QueryErrorPanel
        title="Профиль не загружен"
        subTitle="Сервер не ответил. Проверьте, что бэкенд запущен."
        onRetry={() => onLoadRetry?.()}
        retryLoading={loadRetrying}
      />
    );
  }
  return null;
});
