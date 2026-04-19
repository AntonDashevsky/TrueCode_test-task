import { Card } from 'antd';
import { memo } from 'react';
import type { EditPostState } from '@/features/posts';
import type { PagedPosts } from '@/shared/api';
import { PostsFeedEmptyState } from './posts-feed-empty-state';
import { PostsFeedErrorBlock } from './posts-feed-error-block';
import { PostsFeedLoadingBlock } from './posts-feed-loading-block';
import { PostsFeedPostsList } from './posts-feed-posts-list';
import { PostsFeedToolbar } from './posts-feed-toolbar';

type PostsFeedProps = {
  data: PagedPosts | undefined;
  isInitialLoading?: boolean;
  loadError?: boolean;
  loadRetrying?: boolean;
  onLoadRetry?: () => void;
  page: number;
  sort: 'newest' | 'oldest';
  editState: EditPostState | null;
  onSortChange: (value: 'newest' | 'oldest') => void;
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

export const PostsFeed = memo(function PostsFeed({
  data,
  isInitialLoading = false,
  loadError = false,
  loadRetrying = false,
  onLoadRetry,
  page,
  sort,
  editState,
  onSortChange,
  onPageChange,
  onEditStart,
  onEditCancel,
  onEditTextChange,
  onEditToggleRemoveImage,
  onEditImagesChange,
  onEditNewImageRemove,
  onEditSave,
  onDeletePost,
}: PostsFeedProps) {
  const hasPosts = (data?.items.length ?? 0) > 0;
  const showEmptyFeed = !isInitialLoading && !loadError && !hasPosts;

  return (
    <Card>
      <PostsFeedToolbar
        sort={sort}
        showSort={hasPosts || showEmptyFeed}
        onSortChange={onSortChange}
      />

      {isInitialLoading && !data ? (
        <PostsFeedLoadingBlock />
      ) : loadError && !data ? (
        <PostsFeedErrorBlock
          onRetry={() => onLoadRetry?.()}
          retryLoading={loadRetrying}
        />
      ) : showEmptyFeed ? (
        <PostsFeedEmptyState />
      ) : data ? (
        <PostsFeedPostsList
          data={data}
          page={page}
          editState={editState}
          onPageChange={onPageChange}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onEditTextChange={onEditTextChange}
          onEditToggleRemoveImage={onEditToggleRemoveImage}
          onEditImagesChange={onEditImagesChange}
          onEditNewImageRemove={onEditNewImageRemove}
          onEditSave={onEditSave}
          onDeletePost={onDeletePost}
        />
      ) : null}
    </Card>
  );
});
