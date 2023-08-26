import { PickType } from '@nestjs/swagger';
import { Post } from '../posts.schema';

export class PostRequestDto extends PickType(Post, [
  'title',
  'content',
] as const) {}

export class CreatePostDto extends PickType(Post, [
  'nickname',
  'title',
  'content',
  'userId',
] as const) {}

export class PutRequestDto extends PickType(Post, [
  'title',
  'content',
] as const) {}
