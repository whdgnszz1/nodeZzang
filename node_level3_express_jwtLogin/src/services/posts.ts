import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostService {
  createPost = async (user: Express.User, post: CreatePostRequest) => {
    try {
      const result = await PostRepository.createPost(user, post);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getAllPosts = async (): Promise<AllPostResponse[]> => {
    try {
      const result: AllPostResponse[] = await PostRepository.getAllPosts();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    try {
      // 나중에 처리
      const result: any = await PostRepository.getOnePost(postId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    try {
      const result = await PostRepository.updateOnePost(
        user,
        postId,
        updatePostRequest
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteOnePost = async (
    user: Express.User,
    postId: number,
    password: string
  ) => {
    try {
      const result = await PostRepository.deleteOnePost(user, postId, password);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new PostService();
