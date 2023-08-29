import { Comment } from "../dtos/comments";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class CommentsRepository {
  createComment = async (postId: number, comment: Comment) => {
    const newComment = await prisma.comments.create({
      data: { postId: postId, ...comment },
    });
    return newComment;
  };

  getAllComments = async () => {
    const allComments = await prisma.comments.findMany({});
    return allComments;
  };

  getOneComment = async (commentId: number) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError("해당하는 댓글을 찾을 수 없습니다.", 404);
    }

    return comment;
  };

  updateOneComment = async (
    commentId: number,
    password: string,
    content: string
  ) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError("해당하는 댓글을 찾을 수 없습니다.", 404);
    }

    if (password === comment.password) {
      const updatedComment = await prisma.comments.update({
        where: { commentId: commentId },
        data: {
          content: content,
        },
      });
      return updatedComment;
    } else {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
    }
  };

  deleteOneComment = async (commentId: number, password: string) => {
    const comment = await prisma.comments.findFirst({
      where: { commentId: commentId },
    });

    if (!comment) {
      throw new CustomError("해당하는 댓글을 찾을 수 없습니다.", 404);
    }

    if (password === comment.password) {
      await prisma.comments.delete({
        where: { commentId: commentId },
      });
      return { message: "댓글을 삭제하였습니다." };
    } else {
      throw new CustomError("비밀번호가 일치하지 않습니다.", 401);
    }
  };
}

export default new CommentsRepository();
