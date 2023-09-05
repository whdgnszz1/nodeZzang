import {
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostsService {
  constructor(private readonly postsRepository: PostRepository){}
  createPost = async (user: Express.User, post: CreatePostRequest) => {
    const result = await this.postsRepository.createPost(user, post);
    return result;
  };

  getAllPosts = async (userId: number) => {
    const result = await this.postsRepository.getAllPosts(userId);
    return result;
  };

  getOnePost = async (postId: number): Promise<OnePostResponse> => {
    const result: OnePostResponse = await this.postsRepository.getOnePost(postId);
    return result;
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: UpdatePostRequest
  ) => {
    const result = await this.postsRepository.updateOnePost(
      user,
      postId,
      updatePostRequest
    );
    return result;
  };

  deleteOnePost = async (user: Express.User, postId: number) => {
    const result = await this.postsRepository.deleteOnePost(user, postId);
    return result;
  };
}

export default PostsService
