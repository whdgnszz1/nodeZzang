import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRequestDto } from '../dto/users.request.dto';
import { Users } from '../users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly usersModel: Model<Users>,
  ) {}

  async signUp(body: UsersRequestDto) {
    const { nickname, password, confirmPassword } = body;
    const isNicknameExist = await this.usersModel.findOne({ nickname });
    if (isNicknameExist) {
      throw new HttpException('이미 존재하는 닉네임입니다.', 412);
    }
    if (password !== confirmPassword) {
      throw new HttpException('패스워드가 일치하지 않습니다.', 412);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersModel.create({
      nickname,
      password: hashedPassword,
    });
    console.log(user);
    return { message: '회원 가입에 성공하였습니다.' };
  }
}
