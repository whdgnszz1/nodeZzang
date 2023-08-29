import prisma from "../utils/prisma/index";

class PostRepository {
  createPost = async (post:any) => {
    const newPost = await prisma.posts.create({ data: { ...post } });
    return newPost;
  };
  getAllPosts = () => {};
  getOnePost = () => {};
  updateOnePost = () => {};
  deleteOnePost = () => {};
}

export default new PostRepository();
