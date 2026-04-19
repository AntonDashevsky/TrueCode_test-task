import type { ComponentProps } from 'react';
import { ProfileCard } from '@/widgets/profile-card';
import { PostCreator } from '@/widgets/post-creator';
import { PostsFeed } from '@/widgets/posts-feed';

export type ProfileDashboardProps = {
  appHeader: {
    avatarPath?: string | null;
    initials: string;
    userName: string;
    onLogout: () => void;
    isLoggingOut: boolean;
  };
  profileCard: ComponentProps<typeof ProfileCard>;
  postCreator: ComponentProps<typeof PostCreator>;
  postsFeed: ComponentProps<typeof PostsFeed>;
};
