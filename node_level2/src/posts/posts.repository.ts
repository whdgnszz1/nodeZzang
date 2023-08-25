import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Post } from './posts.schema';
import { PostRequestDto } from './dto/posts.request.dto';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postsModel: Model<Post>,
  ) {}

  async existsById(id: string): Promise<Post> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.postsModel.findById(objectId);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async create(post: PostRequestDto): Promise<Post> {
    try {
      const result = await this.postsModel.create(post);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async getAllPosts(): Promise<any> {
    try {
      const result = await this.postsModel.find({});
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async deletePost(id: string): Promise<any> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.postsModel.deleteOne(objectId);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
