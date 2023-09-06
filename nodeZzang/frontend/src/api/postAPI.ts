import { getAPI, postAPI } from "src/axios";
import { PostRequest, PostResponse } from "src/types/postType";


export const getAllPosts = async (): Promise<PostResponse[]> => {
  const response = await getAPI<{ posts: PostResponse[] }>("/api/posts");
  return response.data.posts;
};

// API 요청을 통해 게시글을 추가하는 코드
export const createPost = async (newPost: PostRequest): Promise<PostResponse> => {
  const response = await postAPI<PostRequest, PostResponse>("/api/posts", newPost);
  return response.data;
};
// API 요청을 통해 유저가 좋아요누른 게시글을 가져오는 코드
export const getUserLikedPosts = async (): Promise<PostResponse[]> => {
  const response = await getAPI<{ posts: PostResponse[] }>("/api/posts/like");
  return response.data.posts;
};
