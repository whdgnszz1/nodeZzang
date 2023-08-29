import { Request, Response, NextFunction } from "express";
import CommentsService from "../services/comments";

// 댓글 생성
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const postId = Number(req.params.postId);
    console.log(req.params);
    const newComment = req.body;
    await CommentsService.createComment(postId, newComment);
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
    const allComments = await CommentsService.getAllComments();
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
    const { password, content } = req.body;
    const commentId: number = Number(req.params.commentId);
    await CommentsService.updateOneComment(commentId, password, content);
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
    const { password } = req.body;
    const commentId: number = Number(req.params.commentId);
    const comment = await CommentsService.deleteOneComment(commentId, password);
    res.send({ message: "댓글을 삭제하였습니다." });
  } catch (error) {
    next(error);
  }
};
