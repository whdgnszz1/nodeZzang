export interface Post {
  title: string;
  content: string;
}

export interface PostResponse {
  id: number;
  postId: number;
  userId: number;
  nickname: string;
  title: string;
  content: string;
  isLiked: boolean;
  createdAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
}
