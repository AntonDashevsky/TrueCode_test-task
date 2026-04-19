import { useProfilePage } from '../model/use-profile-page';
import { ProfileDashboard } from './profile-dashboard';
import { ProfileLoginCard } from './profile-login-card';

export function ProfilePage() {
  const model = useProfilePage();

  if (!model.isAuthed) {
    const { loginCardProps } = model;
    return (
      <ProfileLoginCard
        credentials={loginCardProps.credentials}
        isSubmitting={loginCardProps.isSubmitting}
        onCredentialsChange={loginCardProps.onCredentialsChange}
        onSubmit={loginCardProps.onSubmit}
      />
    );
  }

  const d = model.dashboardProps;
  return (
    <ProfileDashboard
      appHeader={d.appHeader}
      profileCard={d.profileCard}
      postCreator={d.postCreator}
      postsFeed={d.postsFeed}
    />
  );
}
