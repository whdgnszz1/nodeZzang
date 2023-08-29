import PostService from "../services/posts.js";

export const createPost = async (req, res, next) => {
  try {
    const newPost = req.body
    await PostService.createPost(newPost);
    res.send({message: '게시글을 생성하였습니다.'})
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = (req, res, next) => {};
export const getOnePost = (req, res, next) => {};
export const updateOnePost = (req, res, next) => {};
export const deleteOnePost = (req, res, next) => {};
