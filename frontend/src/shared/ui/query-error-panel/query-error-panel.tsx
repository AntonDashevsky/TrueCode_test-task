import { Button, Result } from 'antd';
import { memo } from 'react';

type QueryErrorPanelProps = {
  title: string;
  subTitle: string;
  onRetry: () => void;
  retryLoading?: boolean;
  retryLabel?: string;
};

export const QueryErrorPanel = memo(function QueryErrorPanel({
  title,
  subTitle,
  onRetry,
  retryLoading = false,
  retryLabel = 'Повторить',
}: QueryErrorPanelProps) {
  return (
    <Result
      status="error"
      title={title}
      subTitle={subTitle}
      extra={
        <Button type="primary" loading={retryLoading} onClick={onRetry}>
          {retryLabel}
        </Button>
      }
    />
  );
});
