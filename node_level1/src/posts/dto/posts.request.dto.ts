import { PickType } from '@nestjs/swagger';
import { Post } from '../posts.schema';

export class PostRequestDto extends PickType(Post, [
  'user',
  'password',
  'title',
  'content',
] as const) {}
