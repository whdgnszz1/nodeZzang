import PostService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import {
  AllPostResponse,
  CreatePostRequest,
  OnePostResponse,
  UpdatePostRequest,
} from "../dtos/posts";
import asyncHandler from "../lib/asyncHandler";

// 게시글 생성
export const createPost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, password, title, content } = req.body;

    if (!user || !password || !title || !content) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const newPost: CreatePostRequest = req.body;
    await PostService.createPost(newPost);
    res.send({ message: "게시글을 생성하였습니다." });
  }
);

// 전체 게시글 조회
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allPosts: AllPostResponse[] = await PostService.getAllPosts();
    res.json({ data: allPosts });
  }
);

// 특정 게시글 조회
export const getOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = Number(req.params.postId);
    const post: OnePostResponse = await PostService.getOnePost(postId);
    res.json({ data: post });
  }
);

// 특정 게시글 수정
export const updateOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, title, content } = req.body;
    const postId: number = Number(req.params.postId);
    if (!password || !title || !content || !postId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const updatePostRequest: UpdatePostRequest = req.body;
    const post = await PostService.updateOnePost(postId, updatePostRequest);
    res.send({ message: "게시글을 수정하였습니다." });
  }
);

// 특정 게시글 삭제
export const deleteOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const postId: number = Number(req.params.postId);
    if (!password || !postId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    await PostService.deleteOnePost(postId, password);
    res.send({ message: "게시글을 삭제하였습니다." });
  }
);
