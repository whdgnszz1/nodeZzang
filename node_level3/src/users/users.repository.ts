import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException } from '@nestjs/common';
import { Users } from './users.schema';
import { Model } from 'mongoose';
import { LoginRequestDto } from './dto/users.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from './users.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
  ) {}

  // async findUserByWithoutPassword(userId: string): Promise<Users | null> {
  //   const user = await this.usersModel.findById(userId).select('-password');
  //   return user;
  // }

  // async existsByNickname(nickname: string): Promise<Users | null> {
  //   try {
  //     const result = await this.usersModel.findOne({ nickname });
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }

  // async create(user: LoginRequestDto): Promise<Users> {
  //   try {
  //     const result = await this.usersModel.create(user);
  //     return result;
  //   } catch (error) {
  //     throw new HttpException('DB error', 400);
  //   }
  // }
  async findUserByWithoutPassword(userId: number): Promise<UsersEntity | null> {
    const user = await this.usersRepository.findOne({
      where: { userId },
      select: ['nickname', 'userId'],
    });
    return user;
  }

  async existsByNickname(nickname: string): Promise<UsersEntity | null> {
    try {
      const result = await this.usersRepository.findOneBy({ nickname });
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }

  async create(user: LoginRequestDto): Promise<UsersEntity> {
    try {
      const result = await this.usersRepository.save(user);
      return result;
    } catch (error) {
      throw new HttpException('DB error', 400);
    }
  }
}
