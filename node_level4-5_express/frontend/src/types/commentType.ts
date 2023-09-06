export interface Comment {
  userId: number;
  commentId: number;
  nickname: number;
  content: string;
  createdAt: string;
}

export interface CommentUpdateProps {
  postId: string;
  commentId: string;
  content: string;
}

export interface CommentDeleteProps {
  postId: string;
  commentId: string;
}
