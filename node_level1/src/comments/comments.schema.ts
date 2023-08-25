import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'posts',
  })
  @IsNotEmpty()
  user: Types.ObjectId;

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
  info: string;

  readonly readOnlyData: {
    user: Types.ObjectId;
    content: string;
  };
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);

CommentsSchema.virtual('readOnlyData').get(function (this: Comments) {
  return {
    user: this.user,
    content: this.content,
  };
});
