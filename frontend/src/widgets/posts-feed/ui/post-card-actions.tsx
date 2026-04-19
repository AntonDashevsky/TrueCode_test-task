import { CloseOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { memo } from 'react';

type PostCardActionsProps = {
  isEditing: boolean;
  onEditStart: () => void;
  onDelete: () => void;
  onCancelEdit: () => void;
};

export const PostCardActions = memo(function PostCardActions({
  isEditing,
  onEditStart,
  onDelete,
  onCancelEdit,
}: PostCardActionsProps) {
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
