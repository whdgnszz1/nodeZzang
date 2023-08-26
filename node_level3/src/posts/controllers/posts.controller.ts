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
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectIdValidation.pipe';
import { PostRequestDto, PutRequestDto } from '../dto/posts.request.dto';
import { PostsService } from '../services/posts.service';

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
  // 기술매니저님한테 여쭤보기 Express의 Request를 확장하는것이 나을지, req.user을 any type로 바꿔서 사용하는게 나을지
  createPost(@Body() body: PostRequestDto, @Req() req: Request) {
    const { title, content } = body;
    const user = req.user as any;
    const userId = user._id.toString();
    const nickname = user.nickname;
    return this.postsService.createPost({ title, content, userId, nickname });
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':id')
  getOnePost(@Param('id', new ObjectIdValidationPipe()) id: string) {
    return this.postsService.getOnePost(id);
  }

  @ApiOperation({ summary: '게시글 수정' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOnePost(
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Body() body: PutRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.postsService.updateOnePost(id, body, nickname);
  }

  @ApiOperation({ summary: '게시글 삭제' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deletePost(
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.postsService.deletePost(id, nickname);
  }
}
