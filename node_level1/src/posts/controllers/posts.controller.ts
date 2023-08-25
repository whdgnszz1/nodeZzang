import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PostRequestDto } from '../dto/posts.request.dto';
import { PostsService } from '../services/posts.service';

@Controller('posts')
@UseInterceptors(SuccessInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '전체 게시글 조회' })
  @Get()
  getAllPosts() {
    return 'get all posts';
  }

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  createPost(@Body() body: PostRequestDto) {
    return this.postsService.createPost(body);
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':id')
  getOnePost() {
    return 'get one post';
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  updateOnePost() {
    return 'update one post';
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  deletePost() {
    return 'delete post';
  }
}
