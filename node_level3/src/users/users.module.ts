import { MongooseModule } from '@nestjs/mongoose';
import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { Users, UsersSchema } from './users.schema';
import { UsersRepository } from './users.repository';
import { AuthModule } from 'src/auth/auth.module';
import { UsersEntity } from './users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Users.name, schema: UsersSchema }]),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([UsersEntity]),
  ],
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
