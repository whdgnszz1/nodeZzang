import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// AuthGuard에는 Strategy를 자동으로 실행해주는 기능이 있음
export class JwtAuthGuard extends AuthGuard('jwt') {}
