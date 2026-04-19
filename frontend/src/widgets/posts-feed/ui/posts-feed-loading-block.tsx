import { memo } from 'react';
import { InlineLoading } from '@/shared/ui/inline-loading';

export const PostsFeedLoadingBlock = memo(function PostsFeedLoadingBlock() {
  return (
    <InlineLoading
      tip="Загрузка ленты…"
      minHeight={120}
      style={{ marginTop: 48, marginBottom: 48 }}
    />
  );
});
