import { Injectable, HttpException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginRequestDto, UsersRequestDto } from '../dto/users.request.dto';
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
    const nicknameRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{3,}$/;
    const isValidNickname = nicknameRegExp.exec(nickname);
    if (!isValidNickname) {
      throw new HttpException('닉네임의 형식이 일치하지 않습니다.', 412);
    }
    if (isNicknameExist) {
      throw new HttpException('이미 존재하는 닉네임입니다.', 412);
    }
    if (password.length < 4) {
      throw new HttpException('비밀번호 형식이 일치하지 않습니다.', 412);
    }
    if (password.includes(nickname)) {
      throw new HttpException('비밀번호에 닉네임이 포함되어 있습니다.', 412);
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

  async login(body: LoginRequestDto) {
    const { nickname, password } = body;
    const user = await this.usersModel.findOne({ nickname });
    if (!user) {
      throw new HttpException('닉네임 또는 패스워드를 확인해주세요', 412);
    }
    const validatePassword = bcrypt.compare(password, user.password);
    if (!validatePassword) {
      throw new HttpException('닉네임 또는 패스워드를 확인해주세요', 412);
    }

    const token = 'awfefawe';
    return { token };
  }
}
