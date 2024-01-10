import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('cards')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 댓글 생성
   * @param cardId 댓글 적을 카드아이디
   * @param userId 토큰에서 전달받을 유저의 아이디
   * @returns 저장한 댓글
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':cardId/comments')
  async create(
    @Param('cardId') cardId: number,
    @Request() req,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    const userId = req.user.id;
    const data = await this.commentService.create(
      +cardId,
      userId,
      createCommentDto,
    );
    return {
      statusCode: HttpStatus.CREATED,
      message: '댓글이 저장되었습니다.',
      data,
    };
  }

  /**
   * 댓글 조회
   * @param cardId 댓글 조회할 카드아이디
   * @returns 카드의 댓글
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':cardId/comments')
  async findAll(@Param('cardId') cardId: number) {
    const data = await this.commentService.findAll(+cardId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '댓글 조회에 성공했습니다',
      data,
    };
  }

  /**
   * 댓글 상세 조회
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디 그런데 이미 댓글의 고유아이디가 있는데 카드아이디를 참조해야되나 싶습니다
   * @returns 상세 댓글 하나
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':cardId/comments/:commentId')
  async findOne(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
  ) {
    const data = await this.commentService.findOne(+cardId, +commentId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '댓글 상세 조회에 성공했습니다',
      data,
    };
  }

  /**
   * 댓글 수정
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디
   * @param isUpdated = 1 or 0
   * @returns 특정 댓글 하나
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':cardId/comments/:commentId')
  async update(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Request() req,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const userId = req.user.id;
    const isUpdated = await this.commentService.update(
      +cardId,
      +commentId,
      userId,
      updateCommentDto,
    );
    if (isUpdated) {
      const data = await this.commentService.findOne(+cardId, +commentId);
      return {
        statusCode: HttpStatus.OK,
        message: '댓글이 수정되었습니다.',
        data,
      };
    } else if (!isUpdated) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '댓글 수정에 실패하였습니다.',
      };
    }
  }

  /**
   * 댓글 삭제
   * @param cardId 댓글 조회할 카드아이디
   * @param commentId 댓글 조회할 댓글아이디
   * @param isdeleted = 1, 0
   * @returns 삭제된 댓글
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':cardId/comments/:commentId')
  async remove(
    @Param('cardId') cardId: number,
    @Param('commentId') commentId: number,
    @Request() req,
  ) {
    const userId = req.user.id;
    const isdeleted = await this.commentService.remove(
      +cardId,
      +commentId,
      userId,
    );
    if (isdeleted) {
      return {
        statusCode: HttpStatus.OK,
        message: '댓글이 삭제되었습니다.',
      };
    } else if (!isdeleted) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '댓글 삭제에 실패하였습니다.',
      };
    }
  }
}
