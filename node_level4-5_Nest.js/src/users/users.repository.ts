import { Injectable, HttpException } from '@nestjs/common';
import { LoginRequestDto } from './dto/users.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../common/entities/users.entity';
import { Likes } from 'src/common/entities/like.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
  ) {}

  async findUserByWithoutPassword(userId: number): Promise<Users | null> {
    const user: any = await this.usersRepository.findOne({
      where: { userId },
      select: ['nickname', 'userId'],
    });

    const likePosts: any = await this.likesRepository.find({
      where: { userId },
    });

    user.likePosts = likePosts.map((v) => v.postId);
    return user;
  }

  async existsByNickname(nickname: string): Promise<Users | null> {
    try {
      const result = await this.usersRepository.findOneBy({ nickname });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async create(user: LoginRequestDto): Promise<Users> {
    try {
      const result = await this.usersRepository.save(user);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
