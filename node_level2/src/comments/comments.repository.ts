import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Comments } from './comments.schema';
import { CreateCommentDto } from './dto/\bcomments.request.dto';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
  ) {}

  async existsById(id: string): Promise<Comments> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.commentsModel.findById(objectId);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async findByCommentId(id: string): Promise<Comments | null> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.commentsModel.findById(objectId);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async findByPostId(id: string): Promise<any> {
    try {
      const result = await this.commentsModel.find({ postId: id });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async create(post: CreateCommentDto): Promise<Comments> {
    try {
      const result = await this.commentsModel.create(post);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async getAllComments(): Promise<any> {
    try {
      const result = await this.commentsModel.find({});
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async deleteComment(id: string): Promise<any> {
    try {
      const objectId = new Types.ObjectId(id);
      const result = await this.commentsModel.deleteOne(objectId);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
