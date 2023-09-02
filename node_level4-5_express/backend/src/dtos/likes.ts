export type UserLikedPostsResponse = {
  postId: number;
  userId: number;
  nickname: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number
};
