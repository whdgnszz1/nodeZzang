import { Post } from "../dtos/posts";
import PostRepository from "../repositories/posts";

class PostService {
  createPost = async (post: Post): Promise<Post> => {
    try {
      const result: Post = await PostRepository.createPost(post);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getAllPosts = async (): Promise<Post[]> => {
    try {
      const result: Post[] = await PostRepository.getAllPosts();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getOnePost = async (postId: number): Promise<Post>  => {
    try {
      const result: Post = await PostRepository.getOnePost(postId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  updateOnePost = () => {};
  deleteOnePost = () => {};
}

export default new PostService();
