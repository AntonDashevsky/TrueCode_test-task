import { Card } from 'antd';
import { memo, useEffect, useMemo, useRef } from 'react';
import type { Profile } from '@/shared/api';
import { ProfileCardDetailFields } from './profile-card-detail-fields';
import { ProfileCardEditToolbar } from './profile-card-edit-toolbar';
import { ProfileCardFetchState } from './profile-card-fetch-state';
import { ProfileCardIdentityRow } from './profile-card-identity-row';

type ProfileCardProps = {
  isInitialLoading?: boolean;
  loadError?: boolean;
  loadRetrying?: boolean;
  onLoadRetry?: () => void;
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
    isInitialLoading = false,
    loadError = false,
    loadRetrying = false,
    onLoadRetry,
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

  const showBlockingState =
    !isEditing && !profile && (isInitialLoading || loadError);
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
      {!showBlockingState ? (
        <ProfileCardEditToolbar
          isEditing={isEditing}
          onStartEdit={onStartEdit}
          onCancelEdit={onCancelEdit}
        />
      ) : null}

      <ProfileCardFetchState
        active={showBlockingState}
        isInitialLoading={isInitialLoading}
        loadError={loadError}
        loadRetrying={loadRetrying}
        onLoadRetry={onLoadRetry}
      />

      {!showBlockingState ? (
        <>
          <ProfileCardIdentityRow
            profile={profile}
            form={{ firstName: form.firstName, lastName: form.lastName }}
            avatarPreviewUrl={avatarPreviewUrl}
            isEditing={isEditing}
            avatarInputRef={avatarInputRef}
            onFormChange={onFormChange}
            onAvatarPick={() => {
              if (isEditing) {
                avatarInputRef.current?.click();
              }
            }}
          />

          <ProfileCardDetailFields
            profile={profile}
            form={{
              phone: form.phone,
              birthDate: form.birthDate,
              about: form.about,
            }}
            isEditing={isEditing}
            isSaving={isSaving}
            onFormChange={onFormChange}
            onSave={onSave}
            onCancelEdit={onCancelEdit}
          />

          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => onAvatarChange(e.target.files?.[0] ?? null)}
          />
        </>
      ) : null}
    </Card>
  );
});
