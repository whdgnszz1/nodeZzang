import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LoginRequestDto, UsersRequestDto } from '../dto/users.request.dto';
import { UsersService } from '../services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  signUp(@Body() body: UsersRequestDto) {
    return this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('signup')
  login(@Body() body: LoginRequestDto) {
    return this.usersService.login(body);
  }
}
