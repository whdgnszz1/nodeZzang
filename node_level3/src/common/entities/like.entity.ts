import { Posts } from './posts.entity';
import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Likes {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  postId: number;

  @ManyToOne(() => Users, (user) => user.userId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Posts, (post) => post.postId, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: Posts;
}
