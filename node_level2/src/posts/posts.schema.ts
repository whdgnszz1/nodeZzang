import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Post extends Document {
  @ApiProperty({
    example: 'Developer',
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
    example: '64e83ca6d4f86dbc78018a9b',
    description: 'userId',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @ApiProperty({
    example: '제목입니다.',
    description: 'title',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '내용입니다.',
    description: 'content',
    required: true,
  })
  @Prop()
  @IsString()
  @IsNotEmpty()
  content: string;

  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  readonly readOnlyData: {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    nickname: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    postId: this._id,
    userId: this.userId,
    nickname: this.nickname,
    title: this.title,
    content: this.content,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
});
