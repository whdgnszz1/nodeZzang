import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class CommentsRepository {
  createComment = async (
    user: Express.User,
    postId: number,
    comment: CreateCommentRequest
  ) => {
    const newComment = await prisma.comments.create({
      data: {
        userId: user.userId,
        nickname: user.nickname,
        ...comment,
        postId: postId,
      },
    });
    return newComment;
  };

  getAllComments = async () => {
    const allComments: AllCommentResponse[] = await prisma.comments.findMany({
      select: {
        commentId: true,
        userId: true,
        nickname: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return allComments;
  };

  getOneComment = async (commentId: number) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError(404, "해당하는 댓글을 찾을 수 없습니다.");
    }

    return comment;
  };

  updateOneComment = async (
    user: Express.User,
    commentId: number,
    updateComment: UpdateCommentRequest
  ) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError(404, "댓글 조회에 실패하였습니다.");
    }

    if (user.userId === comment.userId) {
      const updatedComment = await prisma.comments.update({
        where: { commentId: commentId },
        data: {
          content: updateComment.content,
        },
      });
      return updatedComment;
    } else {
      throw new CustomError(403, "댓글의 수정 권한이 존재하지 않습니다.");
    }
  };

  deleteOneComment = async (user: Express.User, commentId: number) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError(404, "댓글 조회에 실패하였습니다..");
    }

    if (user.userId === comment.userId) {
      await prisma.comments.delete({
        where: { commentId: commentId },
      });
      return { message: "댓글을 삭제하였습니다." };
    } else {
      throw new CustomError(403, "댓글의 삭제 권한이 존재하지 않습니다.");
    }
  };
}

export default new CommentsRepository();
