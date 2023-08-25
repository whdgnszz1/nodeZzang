import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Post extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  @IsNotEmpty()
  postId: Types.ObjectId;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  user: string;

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
  title: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  content: string;

  readonly readOnlyData: {
    postId: Types.ObjectId;
    user: string;
    title: string;
  };
}

export const PostSchema = SchemaFactory.createForClass(Post);

PostSchema.virtual('readOnlyData').get(function (this: Post) {
  return {
    postId: this.postId,
    user: this.user,
    title: this.title,
  };
});
