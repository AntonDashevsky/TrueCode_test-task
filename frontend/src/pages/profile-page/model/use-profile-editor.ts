import { useCallback, useState } from 'react';
import type { useProfile } from '@/features/profile';
import type { Profile } from '@/shared/api';
import { emptyProfileForm } from './empty-profile-form';

type ProfileBundle = ReturnType<typeof useProfile>;

export function useProfileEditor({
  profileQuery,
  updateProfileMutation,
  uploadAvatarMutation,
}: ProfileBundle) {
  const [profileForm, setProfileForm] = useState<
    Pick<Profile, 'firstName' | 'lastName' | 'about' | 'phone' | 'birthDate'>
  >(emptyProfileForm);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const onStartProfileEdit = useCallback(() => {
    if (!profileQuery.data) return;
    setProfileForm({
      firstName: profileQuery.data.firstName,
      lastName: profileQuery.data.lastName,
      about: profileQuery.data.about,
      phone: profileQuery.data.phone,
      birthDate: profileQuery.data.birthDate,
    });
    setIsProfileEditing(true);
  }, [profileQuery.data]);

  const onCancelProfileEdit = useCallback(() => {
    setIsProfileEditing(false);
    setAvatarFile(null);
    setProfileForm(emptyProfileForm);
  }, []);

  const handleSaveProfile = useCallback(async () => {
    try {
      await updateProfileMutation.mutateAsync({
        firstName: profileForm.firstName.trim(),
        lastName: profileForm.lastName.trim(),
        phone: profileForm.phone.trim(),
        birthDate: profileForm.birthDate ?? undefined,
        about: profileForm.about.trim(),
      });

      if (avatarFile) {
        await uploadAvatarMutation.mutateAsync(avatarFile);
      }

      setAvatarFile(null);
      setIsProfileEditing(false);
    } catch {
      setAvatarFile(null);
    }
  }, [avatarFile, profileForm, updateProfileMutation, uploadAvatarMutation]);

  const onFormChange = useCallback(
    (patch: Partial<typeof profileForm>) =>
      setProfileForm((prev) => ({ ...prev, ...patch })),
    [],
  );

  const isProfileSaving =
    updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  return {
    profileForm,
    avatarFile,
    isProfileEditing,
    isProfileSaving,
    onFormChange,
    onAvatarChange: setAvatarFile,
    onSave: handleSaveProfile,
    onStartEdit: onStartProfileEdit,
    onCancelEdit: onCancelProfileEdit,
  };
}
