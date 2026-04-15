import { memo } from 'react';
import { Card, Flex, Select, Typography } from 'antd';
import type { EditPostState } from '@/features/posts/model/types';
import type { PagedPosts } from '@/shared/api';
import { PostCard } from './post-card';
import { PostPagination } from './post-pagination';
import { PostEditControls } from './post-edit-controls';

type PostsFeedProps = {
  data: PagedPosts | undefined;
  page: number;
  sort: 'newest' | 'oldest';
  editState: EditPostState | null;
  onSortChange: (value: 'newest' | 'oldest') => void;
  onPageChange: (value: number) => void;
  onPageFirst: () => void;
  onPagePrev: () => void;
  onPageNext: () => void;
  onPageLast: () => void;
  onEditStart: (postId: string, text: string) => void;
  onEditCancel: () => void;
  onEditTextChange: (value: string) => void;
  onEditToggleRemoveImage: (imageId: string) => void;
  onEditImagesChange: (files: File[]) => void;
  onEditNewImageRemove: (index: number) => void;
  onEditSave: (postId: string) => void;
  onDeletePost: (postId: string) => void;
};

export const PostsFeed = memo(function PostsFeed({
  data,
  page,
  sort,
  editState,
  onSortChange,
  onPageChange,
  onPageFirst,
  onPagePrev,
  onPageNext,
  onPageLast,
  onEditStart,
  onEditCancel,
  onEditTextChange,
  onEditToggleRemoveImage,
  onEditImagesChange,
  onEditNewImageRemove,
  onEditSave,
  onDeletePost,
}: PostsFeedProps) {
  const totalPages = data?.pagination.totalPages ?? 1;
  const hasPosts = (data?.items.length ?? 0) > 0;

  return (
    <Card>
      <Flex align="center" justify="space-between">
        <Typography.Title level={4} style={{ margin: 0 }}>
          Лента
        </Typography.Title>
        {hasPosts && (
          <Select
            value={sort}
            onChange={(value: 'newest' | 'oldest') => onSortChange(value)}
            style={{ width: 140 }}
            options={[
              { value: 'newest', label: 'Новые' },
              { value: 'oldest', label: 'Старые' },
            ]}
          />
        )}
      </Flex>

      {!hasPosts ? (
        <Card style={{ textAlign: 'center', marginTop: 12 }}>
          <Typography.Text type="secondary">Записей нет</Typography.Text>
        </Card>
      ) : (
        <>
          <Flex vertical gap={12} style={{ marginTop: 12 }}>
            {data?.items.map((post) => {
              const isEditing = editState?.id === post.id;
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  isEditing={isEditing}
                  editText={isEditing ? editState?.text : undefined}
                  removeImageIds={isEditing ? editState?.removeImageIds : undefined}
                  editTextOnChange={isEditing ? onEditTextChange : undefined}
                  onEditStart={() => onEditStart(post.id, post.text)}
                  onDelete={() => onDeletePost(post.id)}
                  onSave={() => onEditSave(post.id)}
                  onCancelEdit={onEditCancel}
                  onToggleRemoveImage={onEditToggleRemoveImage}
                >
                  {isEditing && editState && (
                    <PostEditControls
                      newImages={editState.newImages}
                      onImagesChange={onEditImagesChange}
                      onNewImageRemove={onEditNewImageRemove}
                      onSave={() => onEditSave(post.id)}
                      onCancel={onEditCancel}
                    />
                  )}
                </PostCard>
              );
            })}
          </Flex>

          <div style={{ marginTop: 12 }}>
            <PostPagination
              page={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              onPageFirst={onPageFirst}
              onPagePrev={onPagePrev}
              onPageNext={onPageNext}
              onPageLast={onPageLast}
            />
          </div>
        </>
      )}
    </Card>
  );
});
