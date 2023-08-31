import CommentsRepository from "../repositories/comments";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";

class CommentService {
  createComment = async (postId: number, newComment: CreateCommentRequest) => {
    const result = await CommentsRepository.createComment(postId, newComment);
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
    commentId: number,
    updateComment: UpdateCommentRequest
  ) => {
    const result = await CommentsRepository.updateOneComment(
      commentId,
      updateComment
    );
    return result;
  };

  deleteOneComment = async (commentId: number, password: string) => {
    const result = await CommentsRepository.deleteOneComment(
      commentId,
      password
    );
    return result;
  };
}

export default new CommentService();
