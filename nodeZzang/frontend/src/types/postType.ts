export interface Post {
  title: string;
  content: string;
}

export interface PostResponse {
  id: number;
  postId: number;
  userId: number;
  profileUrl: string;
  nickname: string;
  title: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
}
