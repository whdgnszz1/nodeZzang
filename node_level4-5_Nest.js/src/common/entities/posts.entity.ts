import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn('increment')
  postId: number;

  @Column()
  userId: number;

  @Column()
  nickname: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: false })
  isLike: boolean;

  @JoinColumn()
  @ManyToOne(() => Users)
  users: Users;
}
