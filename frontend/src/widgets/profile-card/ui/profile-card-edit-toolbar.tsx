import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { memo } from 'react';

type ProfileCardEditToolbarProps = {
  isEditing: boolean;
  onStartEdit: () => void;
  onCancelEdit: () => void;
};

export const ProfileCardEditToolbar = memo(function ProfileCardEditToolbar({
  isEditing,
  onStartEdit,
  onCancelEdit,
}: ProfileCardEditToolbarProps) {
  return (
    <div style={{ position: 'absolute', right: 16, top: 16 }}>
      {isEditing ? (
        <Button size="small" onClick={onCancelEdit} icon={<CloseOutlined />} />
      ) : (
        <Button size="small" onClick={onStartEdit} icon={<EditOutlined />} />
      )}
    </div>
  );
});
