import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import asyncHandler from "../lib/asyncHandler";
import { CustomError } from "../errors/customError";

// 게시글 생성
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.decoded;
    if (!user) {
      throw new CustomError(401, "로그인이 필요한 기능입니다.");
    }
    const newPost: CreatePostRequest = req.body;
    await PostService.createPost(user, newPost);
    res.send({ message: "게시글을 생성하였습니다." });
  }
);

// 전체 게시글 조회
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allPosts: AllPostResponse[] = await PostService.getAllPosts();
    res.json(allPosts);
  }
);

// 특정 게시글 조회
export const getOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = Number(req.params.postId);
    const post: OnePostResponse = await PostService.getOnePost(postId);
    res.json(post);
  }
);

// 특정 게시글 수정
export const updateOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.decoded;
    if (!user) {
      throw new CustomError(401, "로그인이 필요한 기능입니다.");
    }
    const updatePostRequest: UpdatePostRequest = req.body;
    const postId: number = Number(req.params.postId);
    const post = await PostService.updateOnePost(
      user,
      postId,
      updatePostRequest
    );
    res.json(post);
  }
);

// 특정 게시글 삭제
export const deleteOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.decoded;
    if (!user) {
      throw new CustomError(401, "로그인이 필요한 기능입니다.");
    }
    const postId: number = Number(req.params.postId);
    await PostService.deleteOnePost(user, postId);
    res.send({ message: "게시글을 삭제하였습니다." });
  }
);
