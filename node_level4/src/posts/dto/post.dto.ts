import { ApiProperty, PickType } from '@nestjs/swagger';
import { Post } from '../posts.schema';

export class ReadOnlyPostDto extends PickType(Post, [
  'userId',
  'nickname',
  'title',
  'content',
] as const) {
  @ApiProperty({
    example: '60fcbae3910d3c49f1a1e0a7',
    description: 'postId',
  })
  postId: string;

  @ApiProperty({
    example: '2023-08-25T12:15:48.000Z',
    description: 'CreatedAt',
  })
  createdAt: Date;
}
