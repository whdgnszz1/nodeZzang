import { Request, Response, NextFunction } from "express";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";
import asyncHandler from "../lib/asyncHandler";
import CommentsService from "../services/comments";

// 댓글 생성
export const createComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, password, content } = req.body;
    const postId = Number(req.params.postId);

    if (!user || !password || !content || !postId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }

    const newComment: CreateCommentRequest = req.body;
    await CommentsService.createComment(postId, newComment);
    res.send({ message: "댓글을 생성하였습니다." });
  }
);

// 전체 댓글 조회
export const getAllComments = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allComments: AllCommentResponse[] =
      await CommentsService.getAllComments();
    res.json(allComments);
  }
);

// 특정 댓글 조회
export const getOneComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const commentId: number = Number(req.params.commentId);
    const comment = await CommentsService.getOneComment(commentId);
    res.json(comment);
  }
);

// 특정 댓글 수정
export const updateOneComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, content } = req.body;
    const postId = Number(req.params.postId);
    const commentId: number = Number(req.params.commentId);

    if (!password || !content || !postId || !commentId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    const updateComment: UpdateCommentRequest = req.body;
    await CommentsService.updateOneComment(commentId, updateComment);
    res.send({ message: "댓글을 수정하였습니다." });
  }
);

// 특정 댓글 삭제
export const deleteOneComment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const postId = Number(req.params.postId);
    const commentId: number = Number(req.params.commentId);

    if (!password || !postId || !commentId) {
      return res
        .status(400)
        .json({ message: "데이터 형식이 올바르지 않습니다." });
    }
    
    const comment = await CommentsService.deleteOneComment(commentId, password);
    res.send({ message: "댓글을 삭제하였습니다." });
  }
);
