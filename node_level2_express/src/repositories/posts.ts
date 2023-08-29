import { Post } from "../dtos/posts";
import prisma from "../utils/prisma/index";

class PostRepository {
  createPost = async (post: Post) => {
    const newPost = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };
  getAllPosts = () => {};
  getOnePost = () => {};
  updateOnePost = () => {};
  deleteOnePost = () => {};
}

export default new PostRepository();
