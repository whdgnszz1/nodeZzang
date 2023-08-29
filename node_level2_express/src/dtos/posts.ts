export type CreatePostRequest = {
  user: string;
  password: string;
  title: string;
  content: string;
};

export type UpdatePostRequest = {
  password: string;
  title: string;
  content: string;
};

export type AllPostResponse = {
  postId: number;
  user: string;
  title: string;
  createdAt: Date;
};

export type OnePostResponse = {
  postId: number;
  user: string;
  title: string;
  content: string;
  createdAt: Date;
};
