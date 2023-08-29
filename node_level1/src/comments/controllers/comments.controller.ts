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
import { ObjectIdValidationPipe } from 'src/common/pipes/objectIdValidation.pipe';
import { CommentsRequestDto, PutRequestDto } from '../dto/comments.request.dto';
import { CommentsService } from '../services/comments.service';

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
  createComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Body() body: CommentsRequestDto,
  ) {
    return this.commentsService.createComment(postId, body);
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
  updateOneComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Body() body: PutRequestDto,
  ) {
    return this.commentsService.updateOneComment(postId, id, body);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':id')
  deleteComment(
    @Param('postId', new ObjectIdValidationPipe()) postId: string,
    @Param('id', new ObjectIdValidationPipe()) id: string,
    @Body() body: any,
  ) {
    return this.commentsService.deleteComment(postId, id, body);
  }
}
