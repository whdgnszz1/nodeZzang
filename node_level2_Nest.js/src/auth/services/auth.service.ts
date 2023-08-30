import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto } from 'src/users/dto/users.request.dto';
import { UsersRepository } from 'src/users/users.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    // AuthModule의 JwtModule에서 제공하는 공급자
    private jwtService: JwtService,
  ) {}

  async jwtLogin(data: LoginRequestDto) {
    const { nickname, password } = data;

    const user = await this.usersRepository.existsByNickname(nickname);

    if (!user) {
      throw new UnauthorizedException('닉네임과 비밀번호를 확인해주세요');
    }

    const isPasswordValidated = await bcrypt.compare(password, user.password);

    if (!isPasswordValidated) {
      throw new UnauthorizedException('닉네임과 비밀번호를 확인해주세요');
    }

    const payload = { nickname: nickname, sub: user.id };

    return {
      Authorization: this.jwtService.sign(payload),
    };
  }
}
