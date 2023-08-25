import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './controllers/posts.controller';
import { PostsRepository } from './posts.repository';
import { Post, PostSchema } from './posts.schema';
import { PostsService } from './services/posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [PostsService, PostsRepository],
  controllers: [PostsController],
})
export class PostsModule {}
