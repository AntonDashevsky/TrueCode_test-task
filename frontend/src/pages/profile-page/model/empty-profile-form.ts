import type { Profile } from '@/shared/api';

export const emptyProfileForm: Pick<
  Profile,
  'firstName' | 'lastName' | 'about' | 'phone' | 'birthDate'
> = {
  firstName: '',
  lastName: '',
  about: '',
  phone: '',
  birthDate: null,
};
