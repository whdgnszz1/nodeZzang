import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptor';
import { CommentsService } from '../services/comments.service';

@Controller('posts/:postId/comments')
@UseInterceptors(SuccessInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '전체 댓글 조회' })
  @Get()
  getAllPostComment(@Param('postId') postId: string) {
    return this.commentsService.getAllPostComment(postId);
  }

  @ApiOperation({ summary: '댓글 작성' })
  @Post()
  createComment(@Param('postId') postId: string, @Body() body: any) {
    return this.commentsService.createComment(postId, body);
  }

  @ApiOperation({ summary: '댓글 상세 조회' })
  @Get(':id')
  getOneComment(@Param('postId') postId: string, @Param() id: string) {
    return this.commentsService.getOneComment(postId, id);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':id')
  updateOneComment(
    @Param('postId') postId: string,
    @Param() id: string,
    @Body() body: any,
  ) {
    return this.commentsService.updateOneComment(postId, id, body);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':id')
  deleteComment(
    @Param('postId') postId: string,
    @Param() id: string,
    @Body() body: any,
  ) {
    return this.commentsService.deleteComment(postId, id, body);
  }
}
