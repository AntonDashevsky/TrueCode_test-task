import { Avatar, Flex, Typography } from 'antd';
import { memo } from 'react';
import type { Post } from '@/shared/api';
import { getImageUrl } from '@/shared/lib/urls';
import { PostCardActions } from './post-card-actions';
import { PostCardDateTime } from './post-card-datetime';

type PostCardAuthorBlockProps = {
  post: Post;
  isEditing: boolean;
  onEditStart: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
};

export const PostCardAuthorBlock = memo(function PostCardAuthorBlock({
  post,
  isEditing,
  onEditStart,
  onDelete,
  onCancelEdit,
}: PostCardAuthorBlockProps) {
  return (
    <>
      <Flex align="center" gap={8}>
        <Avatar
          size={42}
          src={
            post.author.avatarPath ? getImageUrl(post.author.avatarPath) : undefined
          }
        >
          {(post.author.firstName?.[0] ?? 'U').toUpperCase()}
        </Avatar>
        <Flex vertical gap={0}>
          <Typography.Text strong>
            {[post.author.firstName, post.author.lastName]
              .filter(Boolean)
              .join(' ') || 'Пользователь'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ display: 'block' }}>
            <PostCardDateTime post={post} />
          </Typography.Text>
        </Flex>
      </Flex>
      <div
        style={{
          position: 'absolute',
          right: 16,
          top: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <PostCardActions
          isEditing={isEditing}
          onEditStart={onEditStart}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </>
  );
});
