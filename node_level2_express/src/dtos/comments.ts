export type CreateCommentRequest = {
  user: string;
  password: string;
  content: string;
};

export type UpdateCommentRequest = {
  password: string;
  content: string;
};

export type AllCommentResponse = {
  commentId: number;
  user: string;
  content: string;
  createdAt: Date;
};
