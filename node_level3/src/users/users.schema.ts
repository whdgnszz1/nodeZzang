import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaOptions } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Users extends Document {
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
    example: '1234',
    description: 'confirmPassword',
  })
  @Prop({
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  readonly readOnlyData: {
    nickname: string;
  };
}

export const UsersSchema = SchemaFactory.createForClass(Users);

UsersSchema.virtual('readOnlyData').get(function (this: Users) {
  return {
    nickname: this.nickname,
  };
});
