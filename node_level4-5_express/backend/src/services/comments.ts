import CommentsRepository from "../repositories/comments";
import {
  AllCommentResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
} from "../dtos/comments";

class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  createComment = async (
    user: Express.User,
    postId: number,
    newComment: CreateCommentRequest
  ) => {
    const result = await this.commentsRepository.createComment(
      user,
      postId,
      newComment
    );
    return result;
  };

  getAllComments = async (postId: number) => {
    const result: AllCommentResponse[] =
      await this.commentsRepository.getAllComments(postId);
    return result;
  };

  getOneComment = async (commentId: number) => {
    const result = await this.commentsRepository.getOneComment(commentId);
    return result;
  };

  updateOneComment = async (
    user: Express.User,
    postId: number,
    commentId: number,
    updateComment: UpdateCommentRequest
  ) => {
    const result = await this.commentsRepository.updateOneComment(
      user,
      postId,
      commentId,
      updateComment
    );
    return result;
  };

  deleteOneComment = async (
    user: Express.User,
    postId: number,
    commentId: number
  ) => {
    const result = await this.commentsRepository.deleteOneComment(
      user,
      postId,
      commentId
    );
    return result;
  };
}

export default CommentsService