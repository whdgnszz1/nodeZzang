import { PickType } from '@nestjs/swagger';
import { Users } from '../users.schema';

export class UsersRequestDto extends PickType(Users, [
  'nickname',
  'password',
  'confirmPassword',
] as const) {}

export class LoginRequestDto extends PickType(Users, [
  'nickname',
  'password',
] as const) {}
