import { Avatar, Flex, Input, Typography } from 'antd';
import { memo, type RefObject } from 'react';
import type { Profile } from '@/shared/api';
import { getImageUrl } from '@/shared/lib/urls';

type ProfileCardIdentityRowProps = {
  profile: Profile | undefined;
  form: Pick<Profile, 'firstName' | 'lastName'>;
  avatarPreviewUrl: string | null;
  isEditing: boolean;
  avatarInputRef: RefObject<HTMLInputElement | null>;
  onFormChange: (patch: Partial<Pick<Profile, 'firstName' | 'lastName'>>) => void;
  onAvatarPick: () => void;
};

export const ProfileCardIdentityRow = memo(function ProfileCardIdentityRow({
  profile,
  form,
  avatarPreviewUrl,
  isEditing,
  avatarInputRef,
  onFormChange,
  onAvatarPick,
}: ProfileCardIdentityRowProps) {
  return (
    <Flex align="center" gap={16}>
      <button
        type="button"
        style={{
          position: 'relative',
          border: 'none',
          background: 'transparent',
          padding: 0,
          cursor: isEditing ? 'pointer' : 'default',
        }}
        onClick={onAvatarPick}
        title={isEditing ? 'Сменить аватар' : undefined}
        aria-label={isEditing ? 'Сменить аватар' : 'Аватар профиля'}
      >
        <Avatar
          size={80}
          src={
            avatarPreviewUrl ||
            (profile?.avatarPath ? getImageUrl(profile.avatarPath) : undefined)
          }
        >
          {(profile?.firstName?.[0] ?? 'U').toUpperCase()}
        </Avatar>
        {isEditing ? (
          <span
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              background: '#111',
              color: '#fff',
              borderRadius: 999,
              fontSize: 10,
              padding: '2px 8px',
            }}
          >
            изменить
          </span>
        ) : null}
      </button>
      <div>
        {isEditing ? (
          <Flex gap={8}>
            <Input
              placeholder="Имя"
              value={form.firstName}
              onChange={(e) => onFormChange({ firstName: e.target.value })}
              maxLength={50}
              style={{ width: 160 }}
            />
            <Input
              placeholder="Фамилия"
              value={form.lastName}
              onChange={(e) => onFormChange({ lastName: e.target.value })}
              maxLength={50}
              style={{ width: 180 }}
            />
          </Flex>
        ) : (
          <Typography.Title level={3} style={{ margin: 0 }}>
            {profile?.firstName} {profile?.lastName}
          </Typography.Title>
        )}
        <Typography.Text type="secondary">{profile?.email}</Typography.Text>
      </div>
    </Flex>
  );
});
