import { useCallback, useState } from 'react';
import { useAuth } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { usePosts } from '@/features/posts';
import type { EditPostState } from '@/features/posts/model/types';
import type { Profile } from '@/shared/api';
import { ProfileCard } from '@/widgets/profile-card';
import { PostCreator } from '@/widgets/post-creator';
import { PostsFeed } from '@/widgets/posts-feed';
import { AppHeader } from '@/widgets/app-header';
import { ProfileLoginCard } from './profile-login-card';

const emptyProfileForm: Pick<
  Profile,
  'firstName' | 'lastName' | 'about' | 'phone' | 'birthDate'
> = {
  firstName: '',
  lastName: '',
  about: '',
  phone: '',
  birthDate: null,
};

export function ProfilePage() {
  const { isAuthed, loginMutation, logoutMutation } = useAuth();
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [credentials, setCredentials] = useState({
    email: 'user@example.com',
    password: 'password123',
  });
  const [newPostText, setNewPostText] = useState('');
  const [newPostImages, setNewPostImages] = useState<File[]>([]);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<
    Pick<Profile, 'firstName' | 'lastName' | 'about' | 'phone' | 'birthDate'>
  >(emptyProfileForm);
  const [editState, setEditState] = useState<EditPostState | null>(null);

  const { profileQuery, updateProfileMutation, uploadAvatarMutation } =
    useProfile(isAuthed);
  const {
    postsQuery,
    createPostMutation,
    deletePostMutation,
    editPostMutation,
  } = usePosts({
    enabled: isAuthed,
    page,
    sort,
  });
  const isProfileSaving =
    updateProfileMutation.isPending || uploadAvatarMutation.isPending;

  const onEditStart = useCallback((postId: string, text: string) => {
    setEditState({ id: postId, text, removeImageIds: [], newImages: [] });
  }, []);

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

  const onEditImageToggle = useCallback((imageId: string) => {
    setEditState((prev) => {
      if (!prev) return prev;
      const exists = prev.removeImageIds.includes(imageId);
      return {
        ...prev,
        removeImageIds: exists
          ? prev.removeImageIds.filter((id) => id !== imageId)
          : [...prev.removeImageIds, imageId],
      };
    });
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

  const totalPages = postsQuery.data?.pagination.totalPages ?? 1;

  const onPagePrev = useCallback(
    () => setPage((prev) => Math.max(prev - 1, 1)),
    [],
  );
  const onPageNext = useCallback(
    () =>
      setPage((prev) =>
        Math.min(prev + 1, postsQuery.data?.pagination.totalPages ?? 1),
      ),
    [postsQuery.data?.pagination.totalPages],
  );
  const onEditCancel = useCallback(() => setEditState(null), []);
  const onEditTextChange = useCallback((value: string) => {
    setEditState((prev) => (prev ? { ...prev, text: value } : prev));
  }, []);
  const onEditImagesChange = useCallback((files: File[]) => {
    setEditState((prev) => (prev ? { ...prev, newImages: files } : prev));
  }, []);
  const onEditNewImageRemove = useCallback((index: number) => {
    setEditState((prev) =>
      prev
        ? { ...prev, newImages: prev.newImages.filter((_, i) => i !== index) }
        : prev,
    );
  }, []);
  const onEditSave = useCallback(
    (postId: string) => {
      if (!editState || editState.id !== postId) return;

      const payload = {
        text: editState.text,
        removeImageIds: editState.removeImageIds,
        images: editState.newImages,
      };

      setEditState(null);
      editPostMutation.mutate({
        id: postId,
        data: payload,
      });
    },
    [editState, editPostMutation],
  );
  const onDeletePost = useCallback(
    (postId: string) => deletePostMutation.mutate(postId),
    [deletePostMutation],
  );
  const onCredentialsChange = useCallback(
    (patch: Partial<typeof credentials>) =>
      setCredentials((prev) => ({ ...prev, ...patch })),
    [],
  );
  const onLoginSubmit = useCallback(
    () =>
      loginMutation.mutate({
        email: credentials.email,
        password: credentials.password,
      }),
    [credentials.email, credentials.password, loginMutation],
  );

  if (!isAuthed) {
    return (
      <ProfileLoginCard
        credentials={credentials}
        isSubmitting={loginMutation.isPending}
        onCredentialsChange={onCredentialsChange}
        onSubmit={onLoginSubmit}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <AppHeader
        avatarPath={profileQuery.data?.avatarPath}
        initials={
          `${profileQuery.data?.firstName?.[0] ?? ''}${profileQuery.data?.lastName?.[0] ?? ''}`.toUpperCase() ||
          'U'
        }
        userName={`${profileQuery.data?.firstName ?? ''} ${profileQuery.data?.lastName ?? ''}`.trim()}
        onLogout={() => logoutMutation.mutate()}
        isLoggingOut={logoutMutation.isPending}
      />
      <main
        style={{
          maxWidth: 1024,
          width: '100%',
          margin: '0 auto',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <ProfileCard
          profile={profileQuery.data}
          form={profileForm}
          avatarFile={avatarFile}
          onFormChange={(patch) =>
            setProfileForm((prev) => ({ ...prev, ...patch }))
          }
          onAvatarChange={setAvatarFile}
          onSave={handleSaveProfile}
          onStartEdit={onStartProfileEdit}
          onCancelEdit={onCancelProfileEdit}
          isEditing={isProfileEditing}
          isSaving={isProfileSaving}
        />

        <PostCreator
          text={newPostText}
          images={newPostImages}
          isSubmitting={createPostMutation.isPending}
          onTextChange={setNewPostText}
          onImagesChange={setNewPostImages}
          onImageRemove={(index) =>
            setNewPostImages((prev) => prev.filter((_, i) => i !== index))
          }
          onSubmit={() =>
            createPostMutation.mutate(
              { text: newPostText, images: newPostImages },
              {
                onSuccess: () => {
                  setNewPostText('');
                  setNewPostImages([]);
                },
              },
            )
          }
        />

        <PostsFeed
          data={postsQuery.data}
          page={page}
          sort={sort}
          editState={editState}
          onSortChange={setSort}
          onPageChange={setPage}
          onPageFirst={() => setPage(1)}
          onPagePrev={onPagePrev}
          onPageNext={onPageNext}
          onPageLast={() => setPage(totalPages)}
          onEditStart={onEditStart}
          onEditCancel={onEditCancel}
          onEditTextChange={onEditTextChange}
          onEditToggleRemoveImage={onEditImageToggle}
          onEditImagesChange={onEditImagesChange}
          onEditNewImageRemove={onEditNewImageRemove}
          onEditSave={onEditSave}
          onDeletePost={onDeletePost}
        />
      </main>
    </div>
  );
}
