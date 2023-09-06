export interface Comment {
  userId: number;
  commentId: number;
  content: string;
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
