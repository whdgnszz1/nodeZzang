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
import {
  CreatePostRequestDto,
  PutPostRequestDto,
} from '../dto/posts.request.dto';
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
  // res.locals.user {}
  // 테스트코드 작성하기 (유닛테스트)
  // rds질문 노드관련 cs질문
  // 지하철에서 매칭?? 소개팅앱 내가 내리면 다음사람에게
  // db공부?? 유튜브 쉬운코드
  // 인덱싱 성능개선
  // mvcc => 동시성 트랜젝션 동작에 있어서 격리 레벨
  // 스코프를 늘리려고 테스트코드가 없다거나 한 프로젝트는 좋은게 아님.
  // 인프라 -> ci/cd면 충분
  createPost(@Body() body: CreatePostRequestDto, @Req() req: Request) {
    const { title, content } = body;
    const user = req.user as any;
    const userId = user.userId;
    const nickname = user.nickname;
    return this.postsService.createPost({ title, content, userId, nickname });
  }

  @ApiOperation({ summary: '게시글 상세 조회' })
  @Get(':id')
  getOnePost(@Param('id') id: number) {
    return this.postsService.getOnePost(id);
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
}
