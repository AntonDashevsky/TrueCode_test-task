export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type Profile = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate: string | null;
  about: string;
  phone: string;
  avatarPath: string | null;
};

export type PostImage = {
  id: string;
  path: string;
};

export type PostAuthor = {
  id: string;
  firstName: string;
  lastName: string;
  avatarPath: string | null;
};

export type Post = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  images: PostImage[];
  author: PostAuthor;
};

export type PagedPosts = {
  items: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
