import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
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
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentsRequestDto } from '../dto/\bcomments.request.dto';
import { CommentsService } from '../services/comments.service';
import { Request } from 'express';
@ApiTags('COMMENT')
@Controller('posts/:postId/comments')
@UseInterceptors(SuccessInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '특정 게시글에 달린 댓글 조회' })
  @Get('/')
  getAllPostComment(@Param('postId') postId: number) {
    return this.commentsService.getAllPostComment(Number(postId));
  }

  @ApiOperation({ summary: '댓글 작성' })
  @Post()
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('postId') postId: number,
    @Body() body: CommentsRequestDto,
    @Req() req: Request,
  ) {
    const { content } = body;
    const user = req.user as any;
    const userId = user.userId;
    const nickname = user.nickname;
    return this.commentsService.createComment({
      postId,
      content,
      userId,
      nickname,
    });
  }

  @ApiOperation({ summary: '댓글 상세 조회' })
  @Get(':id')
  getOneComment(@Param('postId') postId: number, @Param('id') id: number) {
    return this.commentsService.getOneComment(postId, id);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOneComment(
    @Param('postId') postId: number,
    @Param('id') id: number,
    @Body() body: CommentsRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.commentsService.updateOneComment(postId, id, body, nickname);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @Param('postId') postId: string,
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.commentsService.deleteComment(postId, id, nickname);
  }
}
