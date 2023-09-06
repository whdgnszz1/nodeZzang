import PostsService from "../services/posts";
import { Request, Response, NextFunction } from "express";
import { PostRequest, PostResponse } from "../dtos/posts";
import asyncHandler from "../lib/asyncHandler";
import { getUserFromToken } from "./auth";

class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 게시글 생성
  createPost = asyncHandler(
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
      const user = getUserFromToken(res);

      const newPost: PostRequest = req.body;
      const result = await this.postsService.createPost(user, newPost);
      res.send({ message: "게시글을 생성하였습니다." });
    }
  );

  // 전체 게시글 조회
  getAllPosts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const userId = res.locals.decoded?.userId;
      const allPosts: PostResponse[] = await this.postsService.getAllPosts(
        userId
      );
      res.json({ posts: allPosts });
    }
  );

  // 특정 게시글 조회
  getOnePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: number = Number(req.params.postId);
      const user: Express.User = res.locals.decoded
      const post: PostResponse = await this.postsService.getOnePost(postId, user.userId);
      res.json({ post: post });
    }
  );

  // 특정 게시글 수정
  updateOnePost = asyncHandler(
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

      const user = getUserFromToken(res);

      const updatePostRequest: PostRequest = req.body;
      const postId: number = Number(req.params.postId);
      const result = await this.postsService.updateOnePost(
        user,
        postId,
        updatePostRequest
      );
      res.send({ message: "게시글을 수정하였습니다." });
    }
  );

  // 특정 게시글 삭제
  deleteOnePost = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = getUserFromToken(res);

      const postId: number = Number(req.params.postId);
      const result = await this.postsService.deleteOnePost(user, postId);
      res.send({ message: "게시글을 삭제하였습니다." });
    }
  );
}

export default PostsController;
