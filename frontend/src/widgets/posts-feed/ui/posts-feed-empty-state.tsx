import { Card, Typography } from 'antd';
import { memo } from 'react';

export const PostsFeedEmptyState = memo(function PostsFeedEmptyState() {
  return (
    <Card style={{ textAlign: 'center', marginTop: 12 }}>
      <Typography.Text type="secondary">Записей нет</Typography.Text>
    </Card>
  );
});
