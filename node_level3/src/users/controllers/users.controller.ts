import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AuthService } from 'src/auth/services/auth.service';
import { LoginRequestDto, UsersRequestDto } from '../dto/users.request.dto';
import { UsersService } from '../services/users.service';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '현재 유저 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get('/currentuser')
  getCurrentUser(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  signUp(@Body() body: UsersRequestDto) {
    return this.usersService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() body: LoginRequestDto) {
    return this.authService.jwtLogin(body);
  }
}
