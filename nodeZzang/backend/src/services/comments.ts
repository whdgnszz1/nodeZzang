import CommentsRepository from "../repositories/comments";
import { CommentRequest, CommentResponse } from "../dtos/comments";

class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  createComment = async (
    user: Express.User,
    postId: number,
    newComment: CommentRequest
  ) => {
    const result = await this.commentsRepository.createComment(
      user,
      postId,
      newComment
    );
    return result;
  };

  getAllComments = async (postId: number) => {
    const result: CommentResponse[] =
      await this.commentsRepository.getAllComments(postId);
    return result;
  };

  updateOneComment = async (
    user: Express.User,
    postId: number,
    commentId: number,
    updateComment: CommentRequest
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

export default CommentsService;
