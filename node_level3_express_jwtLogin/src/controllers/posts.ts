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
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    if (!title.trim()) {
      return res
        .status(412)
        .send({ message: "게시글 제목의 형식이 일치하지 않습니다." });
    }

    if (!content.trim()) {
      return res
        .status(412)
        .send({ message: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    const user = res.locals.decoded;
    if (!user) {
      return res.status(403).send({ message: "로그인이 필요한 기능입니다." });
    }
    const newPost: CreatePostRequest = req.body;
    await PostService.createPost(user, newPost);
    res.send({ message: "게시글 작성에 성공하였습니다." });
  }
);

// 전체 게시글 조회
export const getAllPosts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allPosts: AllPostResponse[] = await PostService.getAllPosts();
    res.json({ posts: allPosts });
  }
);

// 특정 게시글 조회
export const getOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const postId: number = Number(req.params.postId);
    const post: OnePostResponse = await PostService.getOnePost(postId);
    res.json({post});
  }
);

// 특정 게시글 수정
export const updateOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, content } = req.body;
    if (!title || !content) {
      return res
        .status(412)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    if (!title.trim()) {
      return res
        .status(412)
        .send({ message: "게시글 제목의 형식이 일치하지 않습니다." });
    }

    if (!content.trim()) {
      return res
        .status(412)
        .send({ message: "게시글 내용의 형식이 일치하지 않습니다." });
    }

    const user = res.locals.decoded;
    if (!user) {
      return res.status(401).send({ message: "로그인이 필요한 기능입니다." });
    }
    const updatePostRequest: UpdatePostRequest = req.body;
    const postId: number = Number(req.params.postId);
    const result = await PostService.updateOnePost(
      user,
      postId,
      updatePostRequest
    );
    res.send({message: result});
  }
);

// 특정 게시글 삭제
export const deleteOnePost = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.decoded;
    if (!user) {
      return res.status(401).send({ message: "로그인이 필요한 기능입니다." });
    }
    const { password } = req.body;
    const postId: number = Number(req.params.postId);
    const result = await PostService.deleteOnePost(user, postId, password);
    res.send({ message: result });
  }
);
