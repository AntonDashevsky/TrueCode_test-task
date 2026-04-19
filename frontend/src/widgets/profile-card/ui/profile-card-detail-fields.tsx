import { Button, Flex, Input, Typography } from 'antd';
import { memo } from 'react';
import type { Profile } from '@/shared/api';

type ProfileCardDetailFieldsProps = {
  profile: Profile | undefined;
  form: Pick<Profile, 'phone' | 'birthDate' | 'about'>;
  isEditing: boolean;
  isSaving: boolean;
  onFormChange: (
    patch: Partial<Pick<Profile, 'phone' | 'birthDate' | 'about'>>,
  ) => void;
  onSave: () => void;
  onCancelEdit: () => void;
};

export const ProfileCardDetailFields = memo(function ProfileCardDetailFields({
  profile,
  form,
  isEditing,
  isSaving,
  onFormChange,
  onSave,
  onCancelEdit,
}: ProfileCardDetailFieldsProps) {
  return (
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
            onChange={(e) =>
              onFormChange({ birthDate: e.target.value || null })
            }
            max={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <Typography.Text>{profile?.birthDate || '-'}</Typography.Text>
        )}
      </Flex>
      <Flex align="start" gap={10}>
        <Typography.Text
          strong
          style={{ minWidth: 120, marginTop: isEditing ? 6 : 0 }}
        >
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
  );
});
