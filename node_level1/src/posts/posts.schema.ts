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
    description: 'user',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    example: '1234',
    description: 'password',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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

  readonly readOnlyData: {
    postId: Types.ObjectId;
    user: string;
    title: string;
    createdAt: Date;
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    postId: this._id,
    user: this.user,
    title: this.title,
    createdAt: this.createdAt,
  };
});
