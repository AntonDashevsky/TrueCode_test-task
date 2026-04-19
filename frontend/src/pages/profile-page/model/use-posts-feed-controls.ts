import type { Dispatch, SetStateAction } from 'react';
import { useCallback, useState } from 'react';
import type { EditPostState } from '@/features/posts';
import type { usePosts } from '@/features/posts';

type PostsBundle = ReturnType<typeof usePosts>;

type PaginationSetters = {
  setPage: Dispatch<SetStateAction<number>>;
  setSort: Dispatch<SetStateAction<'newest' | 'oldest'>>;
};

export function usePostsFeedControls(
  { deletePostMutation, editPostMutation }: PostsBundle,
  { setPage, setSort }: PaginationSetters,
) {
  const [editState, setEditState] = useState<EditPostState | null>(null);

  const onSortChange = useCallback(
    (value: 'newest' | 'oldest') => {
      setSort(value);
      setPage(1);
    },
    [setPage, setSort],
  );

  const onEditStart = useCallback((postId: string, text: string) => {
    setEditState({ id: postId, text, removeImageIds: [], newImages: [] });
  }, []);

  const onEditCancel = useCallback(() => setEditState(null), []);

  const onEditTextChange = useCallback((value: string) => {
    setEditState((prev) => (prev ? { ...prev, text: value } : prev));
  }, []);

  const onEditImagesChange = useCallback((files: File[]) => {
    setEditState((prev) => (prev ? { ...prev, newImages: files } : prev));
  }, []);

  const onEditNewImageRemove = useCallback((index: number) => {
    setEditState((prev) =>
      prev
        ? { ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }
        : prev,
    );
  }, []);

  const onEditImageToggle = useCallback((imageId: string) => {
    setEditState((prev) => {
      if (!prev) return prev;
      const exists = prev.removeImageIds.includes(imageId);
      return {
        ...prev,
        removeImageIds: exists
          ? prev.removeImageIds.filter((id) => id !== imageId)
          : [...prev.removeImageIds, imageId],
      };
    });
  }, []);

  const onEditSave = useCallback(
    (postId: string) => {
      if (!editState || editState.id !== postId) return;

      editPostMutation.mutate(
        {
          id: postId,
          data: {
            text: editState.text,
            removeImageIds: editState.removeImageIds,
            images: editState.newImages,
          },
        },
        {
          onSuccess: () => {
            setEditState(null);
          },
        },
      );
    },
    [editState, editPostMutation],
  );

  const onDeletePost = useCallback(
    (postId: string) => deletePostMutation.mutate(postId),
    [deletePostMutation],
  );

  return {
    editState,
    onSortChange,
    onEditStart,
    onEditCancel,
    onEditTextChange,
    onEditImagesChange,
    onEditNewImageRemove,
    onEditImageToggle,
    onEditSave,
    onDeletePost,
  };
}
