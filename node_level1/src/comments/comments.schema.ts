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
    description: 'user',
    required: true,
  })
  @Prop({
    required: true,
    ref: 'posts',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    example: '내용',
    description: 'content',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

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

  // @Prop({
  //   required: true,
  // })
  // @IsString()
  // @IsNotEmpty()
  // info: string;

  _id: Types.ObjectId;
  createdAt: Date;

  readonly readOnlyData: {
    commentId: Types.ObjectId;
    user: string;
    content: string;
    createdAt: Date;
  };
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual('readOnlyData').get(function (this: Comments) {
  return {
    commentId: this._id,
    user: this.user,
    content: this.content,
    createdAt: this.createdAt,
  };
});
