import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersRequestDto } from '../dto/users.request.dto';
import { UsersService } from '../services/users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('signup')
  signUp(@Body() body: UsersRequestDto) {
    console.log(body);
    return this.usersService.signUp(body);
  }
}
