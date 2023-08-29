import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import { Post } from "../dtos/posts";

// 게시글 생성
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost = req.body;
    await PostService.createPost(newPost);
    res.send({ message: "게시글을 생성하였습니다." });
  } catch (error) {
    next(error);
  }
};

// 전체 게시글 조회
export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allPosts: Post[] = await PostService.getAllPosts();
    res.json(allPosts);
  } catch (error) {
    next(error);
  }
};

// 특정 게시글 조회
export const getOnePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// 특정 게시글 수정
export const updateOnePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

// 특정 게시글 삭제
export const deleteOnePost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
