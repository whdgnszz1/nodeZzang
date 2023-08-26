import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    example: '종훈',
    description: 'nickname',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @ApiProperty({
    example: '64e8b0b6a3c531048e25830a',
    description: 'userId',
    required: true,
  })
  @Prop({
    required: true,
    ref: 'posts',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '내용',
    description: 'comment',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    example: '64e85e457953b4b0ffe9223c',
    description: 'postId',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  postId: string;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  readonly readOnlyData: {
    commentId: Types.ObjectId;
    userId: string;
    nickname: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual('readOnlyData').get(function (this: Comments) {
  return {
    commentId: this._id,
    nickname: this.nickname,
    content: this.content,
    createdAt: this.createdAt,
    userId: this.userId,
    updatedAt: this.updatedAt,
  };
});
