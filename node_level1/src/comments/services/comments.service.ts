import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments } from '../comments.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
  ) {}

  async createComment(postId: string, body: any) {
    const { user, password, content } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const comment = await this.commentsModel.create({
      postId,
      user,
      content,
      password: hashedPassword,
    });
    console.log(comment.readOnlyData);
    return { message: '댓글을 생성하였습니다.' };
  }
  async getOneComment(postId, id) {
    return;
  }

  async updateOneComment(postId, id, body) {
    const { password, content } = body;
    const objectId = new Types.ObjectId(id);
    const comment = await this.commentsModel.findById(objectId);
    if (!comment) {
      throw new HttpException('존재하지 않는 게시글입니다.', 404);
    }
    const validatePassword = bcrypt.compare(password, comment.password);
    if (!validatePassword) {
      throw new HttpException('비밀번호가 일치하지 않습니다', 403);
    }

    comment.content = content;

    await comment.save();

    return { message: '댓글을 수정하였습니다.' };  }

  async deleteComment(postId, id, body) {
    return;
  }
}
