import { memo } from 'react';
import type { Post } from '@/shared/api';

type PostCardDateTimeProps = {
  post: Post;
};

export const PostCardDateTime = memo(function PostCardDateTime({
  post,
}: PostCardDateTimeProps) {
  const isEdited =
    new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime();
  return (
    <>
      {new Date(post.createdAt).toLocaleString()}
      {isEdited
        ? ` (Отредактировано ${new Date(post.updatedAt).toLocaleString()})`
        : ''}
    </>
  );
});
