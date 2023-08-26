import { UsersEntity } from '../users/users.entity';
import { PostsEntity } from 'src/posts/posts.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class CommentsEntity {
  @PrimaryGeneratedColumn('increment')
  commentId: number;

  @Column()
  userId: number;

  @Column()
  nickname: string;

  @Column()
  content: string;

  @JoinColumn()
  @ManyToOne(() => UsersEntity)
  users: UsersEntity;

  @ManyToOne(() => PostsEntity)
  posts: PostsEntity;
}
