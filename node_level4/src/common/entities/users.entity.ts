import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('increment')
  userId: number;

  @Column()
  nickname: string;

  @Column()
  password: string;
}
