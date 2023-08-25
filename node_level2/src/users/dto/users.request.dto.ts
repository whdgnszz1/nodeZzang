import { PickType } from '@nestjs/swagger';
import { Users } from '../users.schema';

export class UsersRequestDto extends PickType(Users, [
  'nickname',
  'password',
  'confirmPassword',
] as const) {}
