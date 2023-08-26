import { Module } from '@nestjs/common';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from './comments.schema';
import { CommentsRepository } from './comments.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from './comments.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
    ]),
    TypeOrmModule.forFeature([CommentsEntity]),
  ],
  providers: [CommentsService, CommentsRepository],
  controllers: [CommentsController],
})
export class CommentsModule {}
