import { memo } from 'react';
import { AppHeader } from '@/widgets/app-header';
import { ProfileCard } from '@/widgets/profile-card';
import { PostCreator } from '@/widgets/post-creator';
import { PostsFeed } from '@/widgets/posts-feed';
import type { ProfileDashboardProps } from '../model/profile-dashboard-props';

export type { ProfileDashboardProps } from '../model/profile-dashboard-props';

const rootStyle = { minHeight: '100vh' as const, background: '#f5f5f5' as const };
const mainStyle = {
  maxWidth: 1024,
  width: '100%',
  margin: '0 auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
};

export const ProfileDashboard = memo(function ProfileDashboard({
  appHeader,
  profileCard,
  postCreator,
  postsFeed,
}: ProfileDashboardProps) {
  return (
    <div style={rootStyle}>
      <AppHeader
        avatarPath={appHeader.avatarPath}
        initials={appHeader.initials}
        userName={appHeader.userName}
        onLogout={appHeader.onLogout}
        isLoggingOut={appHeader.isLoggingOut}
      />
      <main style={mainStyle}>
        <ProfileCard
          isInitialLoading={profileCard.isInitialLoading}
          loadError={profileCard.loadError}
          loadRetrying={profileCard.loadRetrying}
          onLoadRetry={profileCard.onLoadRetry}
          profile={profileCard.profile}
          form={profileCard.form}
          avatarFile={profileCard.avatarFile}
          onFormChange={profileCard.onFormChange}
          onAvatarChange={profileCard.onAvatarChange}
          onSave={profileCard.onSave}
          onStartEdit={profileCard.onStartEdit}
          onCancelEdit={profileCard.onCancelEdit}
          isEditing={profileCard.isEditing}
          isSaving={profileCard.isSaving}
        />
        <PostCreator
          text={postCreator.text}
          images={postCreator.images}
          isSubmitting={postCreator.isSubmitting}
          onTextChange={postCreator.onTextChange}
          onImagesChange={postCreator.onImagesChange}
          onImageRemove={postCreator.onImageRemove}
          onSubmit={postCreator.onSubmit}
        />
        <PostsFeed
          data={postsFeed.data}
          isInitialLoading={postsFeed.isInitialLoading}
          loadError={postsFeed.loadError}
          loadRetrying={postsFeed.loadRetrying}
          onLoadRetry={postsFeed.onLoadRetry}
          page={postsFeed.page}
          sort={postsFeed.sort}
          editState={postsFeed.editState}
          onSortChange={postsFeed.onSortChange}
          onPageChange={postsFeed.onPageChange}
          onEditStart={postsFeed.onEditStart}
          onEditCancel={postsFeed.onEditCancel}
          onEditTextChange={postsFeed.onEditTextChange}
          onEditToggleRemoveImage={postsFeed.onEditToggleRemoveImage}
          onEditImagesChange={postsFeed.onEditImagesChange}
          onEditNewImageRemove={postsFeed.onEditNewImageRemove}
          onEditSave={postsFeed.onEditSave}
          onDeletePost={postsFeed.onDeletePost}
        />
      </main>
    </div>
  );
});
