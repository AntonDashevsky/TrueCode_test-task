import { Button, Card, Flex, Input, Typography } from 'antd';
import { memo } from 'react';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ProfileLoginCardProps = {
  credentials: LoginCredentials;
  isSubmitting: boolean;
  onCredentialsChange: (patch: Partial<LoginCredentials>) => void;
  onSubmit: () => void;
};

export const ProfileLoginCard = memo(function ProfileLoginCard({
  credentials,
  isSubmitting,
  onCredentialsChange,
  onSubmit,
}: ProfileLoginCardProps) {
  return (
    <div style={{ maxWidth: 480, margin: '40px auto', paddingInline: 16 }}>
      <Card>
        <Flex vertical gap={12}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Вход
          </Typography.Title>
          <Input
            value={credentials.email}
            onChange={(e) => onCredentialsChange({ email: e.target.value })}
          />
          <Input.Password
            value={credentials.password}
            onChange={(e) => onCredentialsChange({ password: e.target.value })}
          />
          <Button onClick={onSubmit} loading={isSubmitting} type="primary">
            Войти
          </Button>
        </Flex>
      </Card>
    </div>
  );
});
