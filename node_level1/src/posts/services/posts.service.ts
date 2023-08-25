import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PostRequestDto } from '../dto/posts.request.dto';
import { Post } from '../posts.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async createPost(body: PostRequestDto) {
    const { user, password, title, content } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const post = await this.postModel.create({
      user,
      title,
      content,
      password: hashedPassword,
    });
    return post.readOnlyData;
  }

  async getOnePost(id: string) {
    const objectId = new Types.ObjectId(id);
    const post = await this.postModel.findById(objectId);
    if (!post) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }

    return post.readOnlyData;
  }
}
