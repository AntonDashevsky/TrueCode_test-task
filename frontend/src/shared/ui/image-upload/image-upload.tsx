import { CloseOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { memo, useEffect, useMemo } from 'react';

type ImageUploadProps = {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  uploadButtonText: string;
  removeButtonAriaLabel?: string;
  removeButtonTitle?: string;
};

export const ImageUpload = memo(function ImageUpload({
  files,
  onFilesChange,
  onFileRemove,
  uploadButtonText,
  removeButtonAriaLabel = 'Удалить выбранное изображение',
  removeButtonTitle = 'Удалить',
}: ImageUploadProps) {
  const uploadFileList: UploadFile[] = useMemo(
    () =>
      files.map((file, index) => ({
        uid: `${file.name}-${index}`,
        name: file.name,
        status: 'done',
        originFileObj: file as UploadFile['originFileObj'],
      })),
    [files],
  );

  const imagePreviews = useMemo(
    () =>
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    [files],
  );

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  return (
    <>
      <Upload
        multiple
        accept="image/*"
        fileList={uploadFileList}
        beforeUpload={() => false}
        onChange={(info) =>
          onFilesChange(
            info.fileList.flatMap((item) =>
              item.originFileObj ? [item.originFileObj as File] : [],
            ),
          )
        }
        onRemove={(file) => {
          const index = uploadFileList.findIndex((item) => item.uid === file.uid);
          if (index >= 0) {
            onFileRemove(index);
          }
          return false;
        }}
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>{uploadButtonText}</Button>
      </Upload>

      {imagePreviews.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {imagePreviews.map((preview, index) => (
            <div key={`${preview.name}-${preview.url}`} style={{ position: 'relative' }}>
              <img
                src={preview.url}
                style={{ height: 80, width: 80, borderRadius: 8, objectFit: 'cover' }}
                title={preview.name}
                alt=""
              />
              <Button
                type="primary"
                danger
                shape="circle"
                size="small"
                style={{ position: 'absolute', right: 4, top: 4 }}
                onClick={() => onFileRemove(index)}
                aria-label={removeButtonAriaLabel}
                title={removeButtonTitle}
                icon={<CloseOutlined />}
              />
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
});
