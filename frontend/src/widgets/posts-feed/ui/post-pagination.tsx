import { Flex, Pagination } from 'antd';
import { memo } from 'react';

type PostPaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export const PostPagination = memo(function PostPagination({
  page,
  total,
  pageSize,
  onPageChange,
}: PostPaginationProps) {
  return (
    <Flex justify="center">
      <Pagination
        current={page}
        total={total}
        pageSize={pageSize}
        onChange={(p) => onPageChange(p)}
        showSizeChanger={false}
        hideOnSinglePage
        showTotal={(t, range) =>
          t === 0
            ? 'Нет записей'
            : `${range[0]}-${range[1]} из ${t}`
        }
      />
    </Flex>
  );
});
