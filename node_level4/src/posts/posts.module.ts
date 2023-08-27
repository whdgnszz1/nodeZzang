import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsRepository } from './posts.repository';
import { PostsService } from './services/posts.service';
import { Posts } from '../common/entities/posts.entity';
import { Likes } from 'src/common/entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts]),
    TypeOrmModule.forFeature([Likes]),
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
  exports: [PostsRepository],
})
export class PostsModule {}
