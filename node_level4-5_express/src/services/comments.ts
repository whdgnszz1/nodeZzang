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
    const result = await CommentsRepository.createComment(
      user,
      postId,
      newComment
    );
    return result;
  };

  getAllComments = async () => {
    const result: AllCommentResponse[] =
      await CommentsRepository.getAllComments();
    return result;
  };

  getOneComment = async (commentId: number) => {
    const result = await CommentsRepository.getOneComment(commentId);
    return result;
  };

  updateOneComment = async (
    user: Express.User,
    commentId: number,
    updateComment: UpdateCommentRequest
  ) => {
    const result = await CommentsRepository.updateOneComment(
      user,
      commentId,
      updateComment
    );
    return result;
  };

  deleteOneComment = async (user: Express.User, commentId: number) => {
    const result = await CommentsRepository.deleteOneComment(user, commentId);
    return result;
  };
}

export default new CommentService();
