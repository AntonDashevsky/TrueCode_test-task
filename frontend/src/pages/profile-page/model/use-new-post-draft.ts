import { useCallback, useState } from 'react';
import type { usePosts } from '@/features/posts';

type PostsBundle = ReturnType<typeof usePosts>;

export function useNewPostDraft({ createPostMutation }: PostsBundle) {
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);

  const onImageRemove = useCallback(
    (index: number) =>
      setImages((prev) => prev.filter((_, i) => i !== index)),
    [],
  );

  const onSubmit = useCallback(() => {
    createPostMutation.mutate(
      { text, images },
      {
        onSuccess: () => {
          setText('');
          setImages([]);
        },
      },
    );
  }, [text, images, createPostMutation]);

  return {
    text,
    setText,
    images,
    setImages,
    onImageRemove,
    onSubmit,
    isSubmitting: createPostMutation.isPending,
  };
}
