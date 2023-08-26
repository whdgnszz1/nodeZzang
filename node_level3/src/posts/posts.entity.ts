import { UsersEntity } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostsEntity {
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

  @JoinColumn()
  @ManyToOne(() => UsersEntity)
  users: UsersEntity;
}
