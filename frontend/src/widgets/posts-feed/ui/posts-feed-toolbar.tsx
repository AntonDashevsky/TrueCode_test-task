import { Flex, Select, Typography } from 'antd';
import { memo } from 'react';

type PostsFeedToolbarProps = {
  sort: 'newest' | 'oldest';
  showSort: boolean;
  onSortChange: (value: 'newest' | 'oldest') => void;
};

export const PostsFeedToolbar = memo(function PostsFeedToolbar({
  sort,
  showSort,
  onSortChange,
}: PostsFeedToolbarProps) {
  return (
    <Flex align="center" justify="space-between">
      <Typography.Title level={4} style={{ margin: 0 }}>
        Лента
      </Typography.Title>
      {showSort ? (
        <Select
          value={sort}
          onChange={(value: 'newest' | 'oldest') => onSortChange(value)}
          style={{ width: 140 }}
          options={[
            { value: 'newest', label: 'Новые' },
            { value: 'oldest', label: 'Старые' },
          ]}
        />
      ) : null}
    </Flex>
  );
});
