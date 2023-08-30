import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { PutPostRequestDto } from '../dto/posts.request.dto';
import { PostsService } from '../services/posts.service';

@ApiTags('POST')
@Controller('posts')
@UseInterceptors(SuccessInterceptor)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({ summary: '전체 게시글 조회' })
  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: '게시글 작성' })
  @Post()
  @UseGuards(JwtAuthGuard)
  createPost(@Body() body, @Req() req: Request) {
    const { title, content } = body;
    const user = req.user as any;
    const userId = user.userId;
    const nickname = user.nickname;
    return this.postsService.createPost({ title, content, userId, nickname });
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getOnePost(@Req() req: Request, @Param('id') postId: number) {
    const user = req.user as any;
    console.log(user);
    const userId = user.userId;
    return this.postsService.getOnePost(postId, userId);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOnePost(
    @Param('id') id: number,
    @Body() body: PutPostRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.postsService.updateOnePost(id, body, nickname);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(@Param('id') id: number, @Req() req: Request) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.postsService.deletePost(id, nickname);
  }

  @ApiOperation({ summary: '좋아요' })
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  toggleLike(@Param('id') postId, @Req() req: Request) {
    const user = req.user as any;
    const userId = user.userId;
    return this.postsService.toggleLike(postId, userId);
  }
}
