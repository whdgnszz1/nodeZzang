import { Injectable, HttpException } from '@nestjs/common';
import { LoginRequestDto } from './dto/users.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from 'src/common/entities/users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUserByWithoutPassword(userId: number): Promise<Users | null> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['nickname', 'userId'],
    });
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
