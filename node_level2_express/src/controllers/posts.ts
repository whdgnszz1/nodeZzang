import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";

export const createPost = async (req:Request, res: Response, next:NextFunction) => {
  try {
    const newPost = req.body
    await PostService.createPost(newPost);
    res.send({message: '게시글을 생성하였습니다.'})
  } catch (error) {
    next(error);
  }
};
export const getAllPosts = (req:Request, res:Response, next:NextFunction) => {};
export const getOnePost = (req:Request, res:Response, next:NextFunction) => {};
export const updateOnePost = (req:Request, res:Response, next:NextFunction) => {};
export const deleteOnePost = (req:Request, res:Response, next:NextFunction) => {};
