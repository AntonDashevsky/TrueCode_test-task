import { memo } from 'react';
import { Button, Flex } from 'antd';

type PostPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageFirst: () => void;
  onPagePrev: () => void;
  onPageNext: () => void;
  onPageLast: () => void;
};

export const PostPagination = memo(function PostPagination({
  page,
  totalPages,
  onPageChange,
  onPageFirst,
  onPagePrev,
  onPageNext,
  onPageLast,
}: PostPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Flex wrap justify="center" gap={8}>
      <Button size="small" onClick={onPageFirst} disabled={page === 1}>
        Первая
      </Button>
      <Button size="small" onClick={onPagePrev} disabled={page === 1}>
        Назад
      </Button>
      {pages.map((pageValue) => (
        <Button
          key={pageValue}
          size="small"
          type={pageValue === page ? 'primary' : 'default'}
          onClick={() => onPageChange(pageValue)}
        >
          {pageValue}
        </Button>
      ))}
      <Button size="small" onClick={onPageNext} disabled={page === totalPages}>
        Вперед
      </Button>
      <Button size="small" onClick={onPageLast} disabled={page === totalPages}>
        Последняя
      </Button>
    </Flex>
  );
});
