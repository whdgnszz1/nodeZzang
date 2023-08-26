import { Injectable, HttpException } from '@nestjs/common';

import { CreatePostRequestDto } from './dto/posts.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from './posts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
  ) {}

  async existsById(id: number): Promise<Posts | null> {
    const result = await this.postsRepository.findOne({
      where: { postId: id },
    });
    if (!result) {
      throw new HttpException('해당 게시글이 존재하지 않습니다.', 404);
    }
    return result;
  }

  async create(post: CreatePostRequestDto): Promise<Posts | null> {
    try {
      const result = await this.postsRepository.save(post);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async getAllPosts(): Promise<any> {
    try {
      const result = await this.postsRepository.find({});
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async deletePost(id: number): Promise<any> {
    try {
      const post = await this.postsRepository.findOneBy({ postId: id });
      const result = await this.postsRepository.remove(post);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
