import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostService {
  createPost = async (post: CreatePostRequest) => {
    const result = await PostRepository.createPost(post);
    return result;
  };

  getAllPosts = async (): Promise<AllPostResponse[]> => {
    const result: AllPostResponse[] = await PostRepository.getAllPosts();
    return result;
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    const result: OnePostResponse = await PostRepository.getOnePost(postId);
    return result;
  };

  updateOnePost = async (
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    const result = await PostRepository.updateOnePost(
      postId,
      updatePostRequest
    );
    return result;
  };

  deleteOnePost = async (postId: number, password: string) => {
    const result = await PostRepository.deleteOnePost(postId, password);
    return result;
  };
}

export default new PostService();
