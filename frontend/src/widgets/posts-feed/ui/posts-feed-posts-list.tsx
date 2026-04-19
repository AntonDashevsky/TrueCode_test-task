import { Flex } from 'antd';
import { memo } from 'react';
import type { EditPostState } from '@/features/posts';
import type { PagedPosts } from '@/shared/api';
import { PostCard } from './post-card';
import { PostEditControls } from './post-edit-controls';
import { PostPagination } from './post-pagination';

type PostsFeedPostsListProps = {
  data: PagedPosts;
  page: number;
  editState: EditPostState | null;
  onPageChange: (value: number) => void;
  onEditStart: (postId: string, text: string) => void;
  onEditCancel: () => void;
  onEditTextChange: (value: string) => void;
  onEditToggleRemoveImage: (imageId: string) => void;
  onEditImagesChange: (files: File[]) => void;
  onEditNewImageRemove: (index: number) => void;
  onEditSave: (postId: string) => void;
  onDeletePost: (postId: string) => void;
};

export const PostsFeedPostsList = memo(function PostsFeedPostsList({
  data,
  page,
  editState,
  onPageChange,
  onEditStart,
  onEditCancel,
  onEditTextChange,
  onEditToggleRemoveImage,
  onEditImagesChange,
  onEditNewImageRemove,
  onEditSave,
  onDeletePost,
}: PostsFeedPostsListProps) {
  const { total = 0, limit = 5 } = data.pagination;

  return (
    <>
      <Flex vertical gap={12} style={{ marginTop: 12 }}>
        {data.items.map((post) => {
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
          total={total}
          pageSize={limit}
          onPageChange={onPageChange}
        />
      </div>
    </>
  );
});
