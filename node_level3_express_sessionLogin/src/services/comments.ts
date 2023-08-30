import CommentsRepository from "../repositories/comments";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";

class CommentService {
  // 의존성주입 해보기
  createComment = async (
    user: Express.User,
    postId: number,
    newComment: CreateCommentRequest
  ) => {
    try {
      const result = await CommentsRepository.createComment(
        user,
        postId,
        newComment
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getAllComments = async () => {
    try {
      const result: AllCommentResponse[] =
        await CommentsRepository.getAllComments();
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getOneComment = async (commentId: number) => {
    try {
      const result = await CommentsRepository.getOneComment(commentId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateOneComment = async (
    user: Express.User,
    commentId: number,
    updateComment: UpdateCommentRequest
  ) => {
    try {
      const result = await CommentsRepository.updateOneComment(
        user,
        commentId,
        updateComment
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteOneComment = async (user: Express.User, commentId: number) => {
    try {
      const result = await CommentsRepository.deleteOneComment(user, commentId);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new CommentService();
