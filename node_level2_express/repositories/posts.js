import prisma from "../utils/prisma/index.js";

class PostRepository {
  createPost = async (post) => {
    const newPost = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };
  getAllPosts = (req, res, next) => {};
  getOnePost = (req, res, next) => {};
  updateOnePost = (req, res, next) => {};
  deleteOnePost = (req, res, next) => {};
}

export default new PostRepository();
