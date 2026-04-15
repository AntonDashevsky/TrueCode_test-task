import { memo } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Avatar, Button, Flex, Layout, Typography } from 'antd';
import { getImageUrl } from '@/shared/lib/urls';

type AppHeaderProps = {
  avatarPath?: string | null;
  initials: string;
  userName?: string;
  onLogout: () => void;
  isLoggingOut?: boolean;
};

export const AppHeader = memo(function AppHeader({
  avatarPath,
  initials,
  userName,
  onLogout,
  isLoggingOut,
}: AppHeaderProps) {
  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        paddingInline: 0,
      }}
    >
      <Flex
        align="center"
        justify="space-between"
        style={{ maxWidth: 1024, margin: '0 auto', height: 64, padding: '0 16px' }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          TrueCode Test Task
        </Typography.Title>
        <Flex align="center" gap={6}>
          <Avatar size={36} src={avatarPath ? getImageUrl(avatarPath) : undefined}>
            {initials}
          </Avatar>
          <Typography.Text strong>{userName || 'Пользователь'}</Typography.Text>
          <Button type="default" size="small" onClick={onLogout} loading={isLoggingOut}>
            <LogoutOutlined />
            Выйти
          </Button>
        </Flex>
      </Flex>
    </Layout.Header>
  );
});
