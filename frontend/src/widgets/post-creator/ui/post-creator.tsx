import { Button, Card, Flex, Input, Typography } from 'antd';
import { memo } from 'react';
import { ImageUpload } from '@/shared/ui/image-upload/image-upload';

type PostCreatorProps = {
  text: string;
  images: File[];
  isSubmitting: boolean;
  onTextChange: (value: string) => void;
  onImagesChange: (files: File[]) => void;
  onImageRemove: (index: number) => void;
  onSubmit: () => void;
};

export const PostCreator = memo(function PostCreator(props: PostCreatorProps) {
  const {
    text,
    images,
    isSubmitting,
    onTextChange,
    onImagesChange,
    onImageRemove,
    onSubmit,
  } = props;
  return (
    <Card>
      <Flex vertical gap={12}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Новый пост
        </Typography.Title>
        <Input.TextArea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="О чем вы думаете?"
          autoSize={{ minRows: 3 }}
        />
        <ImageUpload
          files={images}
          onFilesChange={onImagesChange}
          onFileRemove={onImageRemove}
          uploadButtonText="Добавить изображения"
        />
        <Button
          type="primary"
          onClick={onSubmit}
          disabled={!text.trim()}
          loading={isSubmitting}
        >
          Опубликовать
        </Button>
      </Flex>
    </Card>
  );
});
