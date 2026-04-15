import { memo } from 'react';
import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Input, Typography } from 'antd';
import type { Post } from '@/shared/api';
import { getImageUrl } from '@/shared/lib/urls';

type PostActionsProps = {
  isEditing: boolean;
  onEditStart: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
};

export const PostActions = memo(function PostActions({
  isEditing,
  onEditStart,
  onDelete,
  onCancelEdit,
}: PostActionsProps) {
  return (
    <>
      {isEditing ? (
        <Button
          size="small"
          type="text"
          icon={<CloseOutlined />}
          onClick={onCancelEdit}
          title="Отменить редактирование"
          aria-label="Отменить редактирование"
        />
      ) : (
        <Button
          size="small"
          type="text"
          icon={<EditOutlined />}
          onClick={onEditStart}
          title="Редактировать"
          aria-label="Редактировать"
        />
      )}
      <Button
        danger
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={onDelete}
        title="Удалить"
        aria-label="Удалить"
      />
    </>
  );
});

type PostImagesProps = {
  post: Post;
  isEditing: boolean;
  removeImageIds?: string[];
  onToggleRemoveImage: (imageId: string) => void;
};

export const PostImages = memo(function PostImages({
  post,
  isEditing,
  removeImageIds = [],
  onToggleRemoveImage,
}: PostImagesProps) {
  return (
    <>
      {post.images.map((image) => (
        <div key={image.id} style={{ position: 'relative' }}>
          <img
            style={{ height: 80, width: 80, borderRadius: 8, objectFit: 'cover' }}
            src={getImageUrl(image.path)}
            alt=""
          />
          {isEditing ? (
            <Button
              htmlType="button"
              danger={!removeImageIds.includes(image.id)}
              type={removeImageIds.includes(image.id) ? 'default' : 'primary'}
              shape="circle"
              size="small"
              style={{ position: 'absolute', right: 4, top: 4 }}
              onClick={() => onToggleRemoveImage(image.id)}
              aria-label="Переключить удаление изображения"
              title={removeImageIds.includes(image.id) ? 'Вернуть изображение' : 'Пометить к удалению'}
              icon={<CloseOutlined />}
            />
          ) : null}
          {isEditing && removeImageIds.includes(image.id) && (
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.55)',
                color: 'white',
                fontSize: 12,
                textAlign: 'center',
                padding: 4,
              }}
            >
              к удалению
            </span>
          )}
        </div>
      ))}
    </>
  );
});

type PostDateTimeProps = {
  post: Post;
};

export const PostDateTime = memo(function PostDateTime({ post }: PostDateTimeProps) {
  const isEdited = new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime();
  return (
    <>
      {new Date(post.createdAt).toLocaleString()}
      {isEdited ? ` (Отредактировано ${new Date(post.updatedAt).toLocaleString()})` : ''}
    </>
  );
});

type PostCardProps = {
  post: Post;
  isEditing: boolean;
  editText?: string;
  removeImageIds?: string[];
  editTextOnChange?: (value: string) => void;
  onEditStart: () => void;
  onDelete: () => void;
  onSave: () => void;
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
      <Flex align="center" gap={8}>
        <Avatar
          size={42}
          src={post.author.avatarPath ? getImageUrl(post.author.avatarPath) : undefined}
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
            <PostDateTime post={post} />
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
        <PostActions
          isEditing={isEditing}
          onEditStart={onEditStart}
          onDelete={onDelete}
          onCancelEdit={onCancelEdit}
        />
      </div>

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
        <PostImages
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
