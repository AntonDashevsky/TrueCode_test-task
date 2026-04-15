import { memo } from 'react';
import { Button, Flex } from 'antd';
import { ImageUpload } from '@/shared/ui/image-upload/image-upload';

type PostEditControlsProps = {
  newImages: File[];
  onImagesChange: (files: File[]) => void;
  onNewImageRemove: (index: number) => void;
  onSave: () => void;
  onCancel: () => void;
};

export const PostEditControls = memo(function PostEditControls({
  newImages,
  onImagesChange,
  onNewImageRemove,
  onSave,
  onCancel,
}: PostEditControlsProps) {
  return (
    <Flex vertical gap={10}>
      <ImageUpload
        files={newImages}
        onFilesChange={onImagesChange}
        onFileRemove={onNewImageRemove}
        uploadButtonText="Добавить изображения"
      />
      <Flex gap={8} justify="end">
        <Button type="primary" onClick={onSave}>
          Сохранить изменения
        </Button>
        <Button onClick={onCancel}>
          Отмена
        </Button>
      </Flex>
    </Flex>
  );
});
