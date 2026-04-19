import { Card, Input, Typography } from 'antd';
import { memo } from 'react';
import type { Post } from '@/shared/api';
import { PostCardAuthorBlock } from './post-card-author-block';
import { PostCardImages } from './post-card-images';

type PostCardProps = {
  post: Post;
  isEditing: boolean;
  editText?: string;
  removeImageIds?: string[];
  editTextOnChange?: (value: string) => void;
  onEditStart: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
  onToggleRemoveImage: (imageId: string) => void;
  children?: React.ReactNode;
};

export const PostCard = memo(function PostCard({
  post,
  isEditing,
  editText,
  removeImageIds,
  editTextOnChange,
  onEditStart,
  onDelete,
  onCancelEdit,
  onToggleRemoveImage,
  children,
}: PostCardProps) {
  return (
    <Card style={{ position: 'relative', paddingRight: 112 }}>
      <PostCardAuthorBlock
        post={post}
        isEditing={isEditing}
        onEditStart={onEditStart}
        onDelete={onDelete}
        onCancelEdit={onCancelEdit}
      />

      {isEditing && editText !== undefined ? (
        <Input.TextArea
          value={editText}
          onChange={(e) => editTextOnChange?.(e.target.value)}
          autoSize={{ minRows: 3 }}
          style={{ marginTop: 8 }}
        />
      ) : (
        <Typography.Paragraph style={{ marginTop: 8 }}>
          {post.text}
        </Typography.Paragraph>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginTop: 8,
          marginBottom: 8,
        }}
      >
        <PostCardImages
          post={post}
          isEditing={isEditing}
          removeImageIds={removeImageIds}
          onToggleRemoveImage={onToggleRemoveImage}
        />
      </div>

      {children}
    </Card>
  );
});
