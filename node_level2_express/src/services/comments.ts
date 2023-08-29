import CommentsRepository from "../repositories/comments";
import { Comment } from "../dtos/comments";

class CommentService {
  // 의존성주입 해보기
  createComment = async (postId: number, comment: Comment) => {
    try {
      const result = await CommentsRepository.createComment(postId, comment);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getAllComments = async () => {
    try {
      const result = await CommentsRepository.getAllComments();
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
    commentId: number,
    password: string,
    content: string
  ) => {
    try {
      const result = await CommentsRepository.updateOneComment(
        commentId,
        password,
        content
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteOneComment = async (commentId: number, password: string) => {
    try {
      const result = await CommentsRepository.deleteOneComment(
        commentId,
        password
      );
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new CommentService();
