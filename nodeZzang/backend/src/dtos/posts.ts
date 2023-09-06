export type PostRequest = {
  title: string;
  content: string;
};

export type CreatePostToDataBase = {
  userId: number;
  nickname: string;
  title: string;
  content: string;
};

export type PostResponse = {
  postId: number;
  userId: number;
  nickname: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likeCount: number;
  isLiked: boolean;
};
