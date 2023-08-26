import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Post } from './posts.schema';
import { CreatePostDto } from './dto/posts.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsEntity } from './posts.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
    @InjectRepository(PostsEntity)
    private postsRepository: Repository<PostsEntity>,
  ) {}

  // async existsById(id: string): Promise<Post> {
  //   try {
  //     const objectId = new Types.ObjectId(id);
  //     const result = await this.postsModel.findById(objectId);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }

  // async create(post: CreatePostDto): Promise<Post> {
  //   try {
  //     const result = await this.postsModel.create(post);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }

  // async getAllPosts(): Promise<any> {
  //   try {
  //     const result = await this.postsModel.find({});
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }

  // async deletePost(id: string): Promise<any> {
  //   try {
  //     const objectId = new Types.ObjectId(id);
  //     const result = await this.postsModel.deleteOne(objectId);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }

  async existsById(id: number): Promise<PostsEntity | null> {
    try {
      const result = await this.postsRepository.findOneBy({ postId: id });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async create(post: CreatePostDto): Promise<PostsEntity | null> {
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
