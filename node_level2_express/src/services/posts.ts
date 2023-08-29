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

  getOnePost = async (postId: number): Promise<Post> => {
    try {
      const result: Post = await PostRepository.getOnePost(postId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateOnePost = async (
    postId: number,
    password: string,
    title: string,
    content: string
  ): Promise<Post> => {
    try {
      const result: Post = await PostRepository.updateOnePost(
        postId,
        password,
        title,
        content
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  deleteOnePost = async (postId: number, password: string) => {
    try {
      const result = await PostRepository.deleteOnePost(postId, password);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new PostService();
