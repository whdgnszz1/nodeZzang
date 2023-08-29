import { PickType } from '@nestjs/swagger';
import { Comments } from '../comments.schema';

export class CommentsRequestDto extends PickType(Comments, [
  'user',
  'password',
  'content',
] as const) {}

export class PutRequestDto extends PickType(Comments, [
  'password',
  'content',
] as const) {}
