import { useCallback, useState } from 'react';
import { useAuth } from '@/features/auth';
import { usePosts } from '@/features/posts';
import { useProfile } from '@/features/profile';
import type { ProfileDashboardProps } from './profile-dashboard-props';
import type { ProfileLoginCardProps } from '../ui/profile-login-card';
import { useLoginCredentials } from './use-login-credentials';
import { useNewPostDraft } from './use-new-post-draft';
import { usePostsFeedControls } from './use-posts-feed-controls';
import { useProfileEditor } from './use-profile-editor';

export type ProfilePageGuest = {
  isAuthed: false;
  loginCardProps: ProfileLoginCardProps;
};

export type ProfilePageUser = {
  isAuthed: true;
  dashboardProps: ProfileDashboardProps;
};

export type ProfilePageModel = ProfilePageGuest | ProfilePageUser;

export function useProfilePage(): ProfilePageModel {
  const { isAuthed, loginMutation, logoutMutation } = useAuth();
  const { loginCardProps } = useLoginCredentials(loginMutation);

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');

  const profileBundle = useProfile(isAuthed);
  const postsBundle = usePosts({
    enabled: isAuthed,
    page,
    sort,
  });

  const profileEditor = useProfileEditor(profileBundle);
  const newPost = useNewPostDraft(postsBundle);
  const feed = usePostsFeedControls(postsBundle, { setPage, setSort });

  const { profileQuery } = profileBundle;
  const { postsQuery } = postsBundle;

  const refetchProfileAndPosts = useCallback(() => {
    void profileQuery.refetch();
    void postsQuery.refetch();
  }, [profileQuery, postsQuery]);

  if (!isAuthed) {
    return { isAuthed: false, loginCardProps };
  }

  const dashboardProps: ProfileDashboardProps = {
    appHeader: {
      avatarPath: profileQuery.data?.avatarPath,
      initials:
        `${profileQuery.data?.firstName?.[0] ?? ''}${profileQuery.data?.lastName?.[0] ?? ''}`.toUpperCase() ||
        'U',
      userName: `${profileQuery.data?.firstName ?? ''} ${profileQuery.data?.lastName ?? ''}`.trim(),
      onLogout: () => logoutMutation.mutate(),
      isLoggingOut: logoutMutation.isPending,
    },
    profileCard: {
      isInitialLoading: profileQuery.isLoading && !profileQuery.data,
      loadError: profileQuery.isError && !profileQuery.data,
      loadRetrying: profileQuery.isFetching && profileQuery.isError,
      onLoadRetry: refetchProfileAndPosts,
      profile: profileQuery.data,
      form: profileEditor.profileForm,
      avatarFile: profileEditor.avatarFile,
      onFormChange: profileEditor.onFormChange,
      onAvatarChange: profileEditor.onAvatarChange,
      onSave: profileEditor.onSave,
      onStartEdit: profileEditor.onStartEdit,
      onCancelEdit: profileEditor.onCancelEdit,
      isEditing: profileEditor.isProfileEditing,
      isSaving: profileEditor.isProfileSaving,
    },
    postCreator: {
      text: newPost.text,
      images: newPost.images,
      isSubmitting: newPost.isSubmitting,
      onTextChange: newPost.setText,
      onImagesChange: newPost.setImages,
      onImageRemove: newPost.onImageRemove,
      onSubmit: newPost.onSubmit,
    },
    postsFeed: {
      data: postsQuery.data,
      isInitialLoading: postsQuery.isLoading && !postsQuery.data,
      loadError: postsQuery.isError && !postsQuery.data,
      loadRetrying: postsQuery.isFetching && postsQuery.isError,
      onLoadRetry: refetchProfileAndPosts,
      page,
      sort,
      editState: feed.editState,
      onSortChange: feed.onSortChange,
      onPageChange: setPage,
      onEditStart: feed.onEditStart,
      onEditCancel: feed.onEditCancel,
      onEditTextChange: feed.onEditTextChange,
      onEditToggleRemoveImage: feed.onEditImageToggle,
      onEditImagesChange: feed.onEditImagesChange,
      onEditNewImageRemove: feed.onEditNewImageRemove,
      onEditSave: feed.onEditSave,
      onDeletePost: feed.onDeletePost,
    },
  };

  return { isAuthed: true, dashboardProps };
}
