import { Request, Response, NextFunction } from "express";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";
import CommentsService from "../services/comments";

// 댓글 생성
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.decoded
    if(!user) {
      return res.status(401).send({message: '로그인이 필요한 기능입니다.'})
    }    
    const postId = Number(req.params.postId);
    const newComment: CreateCommentRequest = req.body;
    await CommentsService.createComment(user, postId, newComment);
    res.send({ message: "댓글을 생성하였습니다." });
  } catch (error) {
    next(error);
  }
};

// 전체 댓글 조회
export const getAllComments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allComments: AllCommentResponse[] =
      await CommentsService.getAllComments();
    res.json(allComments);
  } catch (error) {
    next(error);
  }
};

// 특정 댓글 조회
export const getOneComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const commentId: number = Number(req.params.commentId);
    const comment = await CommentsService.getOneComment(commentId);
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

// 특정 댓글 수정
export const updateOneComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.decoded
    if(!user) {
      return res.status(401).send({message: '로그인이 필요한 기능입니다.'})
    }
    const updateComment: UpdateCommentRequest = req.body;
    const commentId: number = Number(req.params.commentId);
    await CommentsService.updateOneComment(user, commentId, updateComment);
    res.send({ message: "댓글을 수정하였습니다." });
  } catch (error) {
    next(error);
  }
};

// 특정 댓글 삭제
export const deleteOneComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.decoded
    if(!user) {
      return res.status(401).send({message: '로그인이 필요한 기능입니다.'})
    }
    const commentId: number = Number(req.params.commentId);
    const comment = await CommentsService.deleteOneComment(user, commentId);
    res.send({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
};
