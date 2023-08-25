import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @Prop({
    required: true,
    ref: 'posts',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  password: string;

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
