export type CreateCommentRequest = {
  content: string;
};

export type UpdateCommentRequest = {
  content: string;
};

export type AllCommentResponse = {
  commentId: number;
  userId: number;
  nickname: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};
