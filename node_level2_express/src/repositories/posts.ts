import { Post } from "../dtos/posts";
import prisma from "../utils/prisma/index";

class PostRepository {
  
  createPost = async (post: Post) => {
    const newPost: Post = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };

  getAllPosts = async () => {
    const allPosts: Post[] = await prisma.posts.findMany({});
    return allPosts;
  };

  getOnePost = () => {};
  updateOnePost = () => {};
  deleteOnePost = () => {};
}

export default new PostRepository();
