import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import asyncHandler from "../lib/asyncHandler";
import { LoginResponse } from "../dtos/auth";

// 게시글 생성
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: LoginResponse = {
      nickname: res.locals.decoded.nickname,
      userId: res.locals.decoded.userId,
    };
    const newPost: CreatePostRequest = req.body;
    await PostService.createPost(user, newPost);
    res.send({ message: "게시글을 생성하였습니다." });
  }
);

// 전체 게시글 조회
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allPosts: AllPostResponse[] = await PostService.getAllPosts();
    res.json({posts: allPosts});
  }
);

// 특정 게시글 조회
export const getOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = Number(req.params.postId);
    const post: OnePostResponse = await PostService.getOnePost(postId);
    res.json({post: post});
  }
);

// 특정 게시글 수정
export const updateOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: LoginResponse = {
      nickname: res.locals.decoded.nickname,
      userId: res.locals.decoded.userId,
    };
    const updatePostRequest: UpdatePostRequest = req.body;
    const postId: number = Number(req.params.postId);
    const post = await PostService.updateOnePost(
      user,
      postId,
      updatePostRequest
    );
    res.send({ message: "게시글을 수정하였습니다." });
  }
);

// 특정 게시글 삭제
export const deleteOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user: LoginResponse = {
      nickname: res.locals.decoded.nickname,
      userId: res.locals.decoded.userId,
    };
    const postId: number = Number(req.params.postId);
    await PostService.deleteOnePost(user, postId);
    res.send({ message: "게시글을 삭제하였습니다." });
  }
);
