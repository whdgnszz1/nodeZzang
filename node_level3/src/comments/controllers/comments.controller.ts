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
import { ApiOperation } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { ObjectIdValidationPipe } from 'src/common/pipes/objectIdValidation.pipe';
import { CommentsRequestDto } from '../dto/\bcomments.request.dto';
import { CommentsService } from '../services/comments.service';
import { Request } from 'express';

@Controller('posts/:postId/comments')
@UseInterceptors(SuccessInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '특정 게시글에 달린 댓글 조회' })
  @Get()
  getAllPostComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
  ) {
    return this.commentsService.getAllPostComment(postId);
  }

  @ApiOperation({ summary: '댓글 작성' })
  @Post()
  @UseGuards(JwtAuthGuard)
  createComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Body() body: CommentsRequestDto,
    @Req() req: Request,
  ) {
    const { content } = body;
    const user = req.user as any;
    const userId = user._id.toString();
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
  getOneComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Param('id', new ObjectIdValidationPipe()) id: string,
  ) {
    return this.commentsService.getOneComment(postId, id);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOneComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Param('id', new ObjectIdValidationPipe()) id: string,
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
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Req() req: Request,
  ) {
    const user = req.user as any;
    const nickname = user.nickname;
    return this.commentsService.deleteComment(postId, id, nickname);
  }
}
