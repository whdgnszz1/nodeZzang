import PostsRepository from "./posts";
import { CommentRequest, CommentResponse } from "../dtos/comments";
import { CustomError } from "../errors/customError";
import prisma from "../utils/prisma/index";

class CommentsRepository {
  constructor(private readonly postsRepository: PostsRepository) {}

  createComment = async (
    user: Express.User,
    postId: number,
    comment: CommentRequest
  ) => {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "해당하는 게시글을 찾을 수 없습니다.");
    }

    const newComment = await prisma.comments.create({
      data: {
        userId: user.userId,
        ...comment,
        postId: postId,
      },
    });
    return newComment;
  };

  getAllComments = async (postId: number) => {
    const allCommentsWithUsers = await prisma.comments.findMany({
      where: { postId: postId },
      include: { user: true },
    });

    const allComments: CommentResponse[] = allCommentsWithUsers.map(
      (comment) => ({
        commentId: comment.commentId,
        userId: comment.userId,
        content: comment.content,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        nickname: comment.user.nickname,
      })
    );

    return allComments;
  };

  updateOneComment = async (
    user: Express.User,
    postId: number,
    commentId: number,
    updateComment: CommentRequest
  ) => {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "게시글이 존재하지 않습니다.");
    }

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

  deleteOneComment = async (
    user: Express.User,
    postId: number,
    commentId: number
  ) => {
    const post = await this.postsRepository.getPostById(postId);

    if (!post) {
      throw new CustomError(404, "게시글이 존재하지 않습니다.");
    }

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

export default CommentsRepository;
