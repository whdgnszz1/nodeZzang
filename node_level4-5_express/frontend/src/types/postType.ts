export interface Post {
  title: string;
  content: string;
}

export interface PostResponse {
  id: number;
  title: string;
  content: string;
  postId: number;
  isLiked: boolean;
}

export interface PostRequest {
  title: string;
  content: string;
}
