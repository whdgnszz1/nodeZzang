import { Users } from './users.entity';
import { Posts } from 'src/common/entities/posts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn('increment')
  commentId: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  nickname: string;

  @Column()
  content: string;

  @JoinColumn()
  @ManyToOne(() => Users)
  users: Users;

  @ManyToOne(() => Posts)
  posts: Posts;
}
