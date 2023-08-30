import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { Users } from '../common/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Likes } from 'src/common/entities/like.entity';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([Users]),
    TypeOrmModule.forFeature([Likes]),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
