export type CommentRequest = {
  content: string;
};

export type CommentResponse = {
  commentId: number;
  userId: number;
  nickname: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
