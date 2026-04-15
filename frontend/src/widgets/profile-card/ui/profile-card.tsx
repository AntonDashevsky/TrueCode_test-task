import { memo, useEffect, useMemo, useRef } from 'react';
import { CloseOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Input, Typography } from 'antd';
import type { Profile } from '@/shared/api';
import { getImageUrl } from '@/shared/lib/urls';

type ProfileCardProps = {
  profile: Profile | undefined;
  form: {
    firstName: string;
    lastName: string;
    about: string;
    phone: string;
    birthDate: string | null;
  };
  avatarFile: File | null;
  onFormChange: (patch: Partial<ProfileCardProps['form']>) => void;
  onAvatarChange: (file: File | null) => void;
  onSave: () => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  isSaving: boolean;
};

export const ProfileCard = memo(function ProfileCard(props: ProfileCardProps) {
  const {
    profile,
    form,
    avatarFile,
    onFormChange,
    onAvatarChange,
    onSave,
    onStartEdit,
    onCancelEdit,
    isEditing,
    isSaving,
  } = props;
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const avatarPreviewUrl = useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : null),
    [avatarFile],
  );

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  return (
    <Card style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', right: 16, top: 16 }}>
        {isEditing ? (
          <Button size="small" onClick={onCancelEdit} icon={<CloseOutlined />} />
        ) : (
          <Button size="small" onClick={onStartEdit} icon={<EditOutlined />} />
        )}
      </div>

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
          onClick={() => isEditing && avatarInputRef.current?.click()}
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
          <Typography.Text type="secondary">
            {profile?.email}
          </Typography.Text>
        </div>
      </Flex>

      <Flex vertical gap={12} style={{ marginTop: 16 }}>
        <Flex align="center" gap={10}>
          <Typography.Text strong style={{ minWidth: 120 }}>
            Телефон:
          </Typography.Text>
          {isEditing ? (
            <Input
              placeholder="+70000000000"
              value={form.phone}
              onChange={(e) => onFormChange({ phone: e.target.value })}
              inputMode="tel"
            />
          ) : (
            <Typography.Text>{profile?.phone || '-'}</Typography.Text>
          )}
        </Flex>
        <Flex align="center" gap={10}>
          <Typography.Text strong style={{ minWidth: 120 }}>
            Дата рождения:
          </Typography.Text>
          {isEditing ? (
            <Input
              style={{ maxWidth: 220 }}
              type="date"
              value={form.birthDate ?? ''}
              onChange={(e) => onFormChange({ birthDate: e.target.value || null })}
              max={new Date().toISOString().split('T')[0]}
            />
          ) : (
            <Typography.Text>{profile?.birthDate || '-'}</Typography.Text>
          )}
        </Flex>
        <Flex align="start" gap={10}>
          <Typography.Text strong style={{ minWidth: 120, marginTop: isEditing ? 6 : 0 }}>
            О себе:
          </Typography.Text>
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <Input.TextArea
                placeholder="Расскажите кратко о себе"
                value={form.about}
                onChange={(e) => onFormChange({ about: e.target.value })}
                autoSize={{ minRows: 3, maxRows: 6 }}
                showCount
                maxLength={300}
              />
            ) : (
              <Typography.Paragraph style={{ margin: 0 }}>
                {profile?.about || '-'}
              </Typography.Paragraph>
            )}
          </div>
        </Flex>

        {isEditing ? (
          <>
            <Typography.Text type="secondary">
              Нажмите на аватар, чтобы выбрать новое изображение.
            </Typography.Text>
            <Flex gap={8} wrap>
              <Button type="primary" onClick={onSave} loading={isSaving}>
                Сохранить профиль
              </Button>
              <Button onClick={onCancelEdit} disabled={isSaving}>
                Отмена
              </Button>
            </Flex>
          </>
        ) : null}
      </Flex>
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
      />
    </Card>
  );
});
