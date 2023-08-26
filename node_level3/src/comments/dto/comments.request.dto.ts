import { PickType } from '@nestjs/swagger';
import { Comments } from '../comments.schema';

export class CommentsRequestDto extends PickType(Comments, [
  'content',
] as const) {}

export class CreateCommentRequestDto extends PickType(Comments, [
  'userId',
  'nickname',
  'content',
  'postId',
] as const) {}
