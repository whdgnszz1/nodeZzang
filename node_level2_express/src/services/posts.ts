import { Post } from '../dtos/posts';
import PostRepository from '../repositories/posts'

class PostService {
  createPost = (post: Post) => {
    try {
      const result = PostRepository.createPost(post);
      return result
    } catch (error) {
      console.error(error);
    }
  };
  getAllPosts = () => {};
  getOnePost = () => {};
  updateOnePost = () => {};
  deleteOnePost = () => {};
}

export default new PostService();
