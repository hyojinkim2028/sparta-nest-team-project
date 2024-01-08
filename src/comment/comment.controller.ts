import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  // UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from '@nestjs/passport';

@Controller('cards')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   * @param cardId 댓글 적을 카드아이디
   * @param userId 토큰에서 전달받을 유저의 아이디
   * @returns 저장한 댓글
   */
  // @ApiBearerAuth()
  // @UseGuards(AuthGuard(''))
  @Post(':cardId/comments')
  async create(
    @Param('cardId') cardId: number,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    // const userId = req.user.id;
    return await this.commentService.create(+cardId, createCommentDto);
  }

  /**
   * 댓글 조회
   * @param cardId 댓글 조회할 카드아이디
   * @returns 카드의 댓글
   */
  @Get(':cardId/comments')
  findAll(@Param('cardId') cardId: number, @Request() req) {
    // const userId = req.user.id;
    return this.commentService.findAll(+cardId);
  }

  /**
   * 특정 댓글 조회
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디 그런데 이미 댓글의 고유아이디가 있는데 카드아이디를 참조해야되나 싶습니다
   * @returns 특정 댓글 하나
   */
  @Get(':cardId/comments/:commentId')
  findOne(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Request() req,
  ) {
    // const userId = req.user.id;
    return this.commentService.findOne(+cardId, +commentId);
  }

  /**
   * 댓글 수정
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디
   * @returns 특정 댓글 하나 01/09 01:00 기준 알수없는 리턴값을 받음
   */
  @Patch(':cardId/comments/:commentId')
  update(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    // const userId = req.user.id;
    return this.commentService.update(+cardId, +commentId, updateCommentDto);
  }

    /**
   * 댓글 수정
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디
   * @returns 삭제된 댓글
   */
  @Delete(':cardId/comments/:commentId')
  remove(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Request() req,
  ) {
    // const userId = req.user.id;
    return this.commentService.remove(+cardId, +commentId);
  }
}
