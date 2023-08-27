import { Injectable, HttpException } from '@nestjs/common';

import { CreatePostRequestDto } from './dto/posts.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts } from '../common/entities/posts.entity';
import { Repository } from 'typeorm';
import { Likes } from 'src/common/entities/like.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
  ) {}

  async existsById(id: number, userId: number | null): Promise<Posts | null> {
    const post = await this.postsRepository.findOne({
      where: { postId: id },
    });

    if (!post) {
      throw new HttpException('해당 게시글이 존재하지 않습니다.', 404);
    }
    const isLike = await this.likesRepository.findOne({
      where: { postId: id, userId: userId },
    });
    if (isLike) {
      post.isLike = true;
    } else {
      post.isLike = false;
    }

    const likeArr = await this.likesRepository.find({
      where: { postId: id },
    });
    post.likeCount = likeArr.length;

    return post;
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

  async toggleLike(postId, userId) {
    try {
      const existingLike = await this.likesRepository.findOne({
        where: { postId, userId },
      });

      if (existingLike) {
        await this.likesRepository.remove(existingLike);
        return '좋아요 취소';
      } else {
        const newLike = new Likes();
        newLike.postId = postId;
        newLike.userId = userId;
        await this.likesRepository.save(newLike);
        return '좋아요';
      }
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
