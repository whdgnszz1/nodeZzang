import { CreateCommentRequestDto } from '../dto/comments.request.dto';
import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsRepository } from '../comments.repository';
import { CommentsRequestDto } from '../dto/comments.request.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async getAllPostComment(postId: number) {
    const allPostComments = await this.commentsRepository.findByPostId(postId);
    return allPostComments;
  }

  async createComment(body: CreateCommentRequestDto) {
    await this.commentsRepository.create(body);
    return { message: '댓글을 생성하였습니다.' };
  }

  async getOneComment(postId: number, id: number) {
    const comment = await this.commentsRepository.findByCommentId(id);
    if (!comment) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }

    return comment;
  }

  async updateOneComment(
    postId: number,
    id: number,
    body: CommentsRequestDto,
    nickname: string,
  ) {
    const { content } = body;
    const comment = await this.commentsRepository.findByCommentId(id);
    if (!comment) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (comment.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    comment.content = content;
    await this.commentsRepository.updateComment(comment);

    return { message: '댓글을 수정하였습니다.' };
  }

  async deleteComment(postId: string, id: number, nickname: string) {
    const comment = await this.commentsRepository.findByCommentId(id);
    if (!comment) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    if (comment.nickname !== nickname) {
      throw new UnauthorizedException('접근 불가능한 기능입니다.');
    }

    await this.commentsRepository.deleteComment(id);

    return { message: '댓글을 삭제하였습니다.' };
  }
}
