import { useCallback, useState } from 'react';
import type { useAuth } from '@/features/auth';
import type { ProfileLoginCardProps } from '../ui/profile-login-card';

type LoginMutation = ReturnType<typeof useAuth>['loginMutation'];

export function useLoginCredentials(loginMutation: LoginMutation) {
  const [credentials, setCredentials] = useState({
    email: 'user@example.com',
    password: 'password123',
  });

  const onCredentialsChange = useCallback(
    (patch: Partial<typeof credentials>) =>
      setCredentials((prev) => ({ ...prev, ...patch })),
    [],
  );

  const onSubmit = useCallback(
    () =>
      loginMutation.mutate({
        email: credentials.email,
        password: credentials.password,
      }),
    [credentials.email, credentials.password, loginMutation],
  );

  const loginCardProps: ProfileLoginCardProps = {
    credentials,
    isSubmitting: loginMutation.isPending,
    onCredentialsChange,
    onSubmit,
  };

  return { loginCardProps };
}
