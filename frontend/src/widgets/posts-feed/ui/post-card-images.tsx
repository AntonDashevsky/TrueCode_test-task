import { CloseOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { memo } from 'react';
import type { Post } from '@/shared/api';
import { getImageUrl } from '@/shared/lib/urls';

type PostCardImagesProps = {
  post: Post;
  isEditing: boolean;
  removeImageIds?: string[];
  onToggleRemoveImage: (imageId: string) => void;
};

export const PostCardImages = memo(function PostCardImages({
  post,
  isEditing,
  removeImageIds = [],
  onToggleRemoveImage,
}: PostCardImagesProps) {
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
              title={
                removeImageIds.includes(image.id)
                  ? 'Вернуть изображение'
                  : 'Пометить к удалению'
              }
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
