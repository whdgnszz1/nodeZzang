import { PickType } from '@nestjs/swagger';
import { Comments } from '../comments.schema';

export class CommentsRequestDto extends PickType(Comments, [
  'content',
] as const) {}

export class CreateCommentDto extends PickType(Comments, [
  'userId',
  'nickname',
  'content',
  'postId',
] as const) {}
