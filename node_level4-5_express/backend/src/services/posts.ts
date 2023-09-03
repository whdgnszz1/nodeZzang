import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostService {
  createPost = async (user: Express.User, post: CreatePostRequest) => {
    const result = await PostRepository.createPost(user, post);
    return result;
  };

  getAllPosts = async (userId: number) => {
    const result = await PostRepository.getAllPosts(userId);
    return result;
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    const result: OnePostResponse = await PostRepository.getOnePost(postId);
    return result;
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    const result = await PostRepository.updateOnePost(
      user,
      postId,
      updatePostRequest
    );
    return result;
  };

  deleteOnePost = async (user: Express.User, postId: number) => {
    const result = await PostRepository.deleteOnePost(user, postId);
    return result;
  };
}

export default new PostService();
