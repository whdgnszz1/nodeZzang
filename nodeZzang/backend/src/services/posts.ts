import { PostRequest, PostResponse } from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostsService {
  constructor(private readonly postsRepository: PostRepository) {}

  createPost = async (user: Express.User, post: PostRequest) => {
    const result = await this.postsRepository.createPost(user, post);
    return result;
  };

  getAllPosts = async (userId: number): Promise<PostResponse[]> => {
    const result: PostResponse[] = await this.postsRepository.getAllPosts(
      userId
    );
    return result;
  };

  getOnePost = async (
    postId: number,
    userId: number | undefined
  ): Promise<PostResponse> => {
    const result: PostResponse = await this.postsRepository.getOnePost(
      postId,
      userId
    );
    return result;
  };

  updateOnePost = async (
    user: Express.User,
    postId: number,
    updatePostRequest: PostRequest
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

export default PostsService;
