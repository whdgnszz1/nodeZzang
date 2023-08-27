import { PickType } from '@nestjs/swagger';
import { Post } from '../posts.schema';

export class CreatePostRequestDto extends PickType(Post, [
  'nickname',
  'title',
  'content',
  'userId',
] as const) {}

export class PutPostRequestDto extends PickType(Post, [
  'title',
  'content',
] as const) {}
