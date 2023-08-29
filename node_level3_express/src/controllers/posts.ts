import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";

// 게시글 생성
export const createPost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newPost: CreatePostRequest = req.body;
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
    const allPosts: AllPostResponse[] = await PostService.getAllPosts();
    res.json(allPosts);
  } catch (error) {
    next(error);
  }
};

// 특정 게시글 조회
export const getOnePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId: number = Number(req.params.postId);
    const post: OnePostResponse = await PostService.getOnePost(postId);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// 특정 게시글 수정
export const updateOnePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatePostRequest: UpdatePostRequest = req.body;
    const postId: number = Number(req.params.postId);
    const post = await PostService.updateOnePost(postId, updatePostRequest);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

// 특정 게시글 삭제
export const deleteOnePost = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { password } = req.body;
    const postId: number = Number(req.params.postId);
    await PostService.deleteOnePost(postId, password);
    res.send({ message: "게시글을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
};
