import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, HttpException } from '@nestjs/common';
import { CreateCommentRequestDto } from './dto/comments.request.dto';
import { Repository } from 'typeorm';
import { PostsRepository } from 'src/posts/posts.repository';
import { Comments } from 'src/common/entities/comments.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    private postsRepository: PostsRepository,
  ) {}

  async existsById(id: number): Promise<Comments> {
    try {
      const result = await this.commentsRepository.findOneBy({ commentId: id });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async findByCommentId(id: number): Promise<Comments | null> {
    try {
      const result = await this.commentsRepository.findOneBy({ commentId: id });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async findByPostId(id: number): Promise<any> {
    const result = await this.commentsRepository.find({
      where: { postId: id },
    });
    return result;
  }

  async create(comment: CreateCommentRequestDto): Promise<Comments> {
    const post = await this.postsRepository.existsById(Number(comment.postId));
    if (!post) {
      throw new HttpException('해당 게시글이 존재하지 않습니다.', 404);
    }

    const result = await this.commentsRepository.save(comment);
    return result;
  }

  async updateComment(comment: Comments): Promise<void> {
    await this.commentsRepository.save(comment);
  }

  async getAllComments(): Promise<any> {
    const result = await this.commentsRepository.find({});
    return result;
  }

  async deleteComment(id: number): Promise<any> {
    const comment = await this.commentsRepository.findOneBy({
      commentId: id,
    });
    const result = await this.commentsRepository.remove(comment);
    return result;
  }
}
