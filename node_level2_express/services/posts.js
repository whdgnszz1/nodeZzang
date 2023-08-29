import PostRepository from '../repositories/posts.js'

class PostService {
  createPost = (post) => {
    try {
      const result = PostRepository.createPost(post);
      return result
    } catch (error) {
      console.error(error);
    }
  };
  getAllPosts = (req, res, next) => {};
  getOnePost = (req, res, next) => {};
  updateOnePost = (req, res, next) => {};
  deleteOnePost = (req, res, next) => {};
}

export default new PostService();
