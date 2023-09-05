import { Request, Response, NextFunction } from "express";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";
import { CustomError } from "../errors/customError";
import asyncHandler from "../lib/asyncHandler";
import { getUserFromToken } from "./auth";

import CommentsService from "../services/comments";

// 댓글 생성
class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  createComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { content } = req.body;
      if (!content) {
        return res
          .status(412)
          .send({ message: "데이터 형식이 올바르지 않습니다." });
      }
      const user = getUserFromToken(res);

      const postId = Number(req.params.postId);
      const newComment: CreateCommentRequest = req.body;
      await this.commentsService.createComment(user, postId, newComment);
      res.status(200).send({ message: "댓글을 생성하였습니다." });
    }
  );

  // 전체 댓글 조회
  getAllComments = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const postId: number = +req.params.postId;
      const allComments: AllCommentResponse[] =
        await this.commentsService.getAllComments(postId);
      res.status(200).json({ comments: allComments });
    }
  );

  // 특정 댓글 조회 (과제에 없는 기능)
  getOneComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const commentId: number = Number(req.params.commentId);
      const comment = await this.commentsService.getOneComment(commentId);
      res.status(200).json({ comment });
    }
  );

  // 특정 댓글 수정
  updateOneComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (res.locals.decoded) {
        const { content } = req.body;
        const postId: number = +req.params.postId;

        if (!content) {
          return res
            .status(412)
            .send({ message: "데이터 형식이 올바르지 않습니다." });
        }

        const user = getUserFromToken(res);

        const updateComment: UpdateCommentRequest = req.body;
        const commentId: number = Number(req.params.commentId);
        const result = await this.commentsService.updateOneComment(
          user,
          postId,
          commentId,
          updateComment
        );
        res.status(200).send({ message: "댓글을 수정하였습니다." });
      } else {
        throw new CustomError(403, "로그인이 필요한 기능입니다.");
      }
    }
  );

  // 특정 댓글 삭제
  deleteOneComment = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (res.locals.decoded) {
        const postId: number = +req.params.postId;

        const user = getUserFromToken(res);

        const commentId: number = Number(req.params.commentId);
        const result = await this.commentsService.deleteOneComment(
          user,
          postId,
          commentId
        );
        res.status(200).send({ message: "댓글을 삭제하였습니다." });
      } else {
        throw new CustomError(403, "로그인이 필요한 기능입니다.");
      }
    }
  );
}

export default CommentsController;
