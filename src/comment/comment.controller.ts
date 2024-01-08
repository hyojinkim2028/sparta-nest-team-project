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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('cards/:cardId/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    @Param('cardId') private readonly cardId: number,
  ) {}

  //댓글 생성
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createCommentDto: CreateCommentDto) {
    const cardId: number = this.cardId;
    const userId = req.user.id;
    return this.commentService.create(createCommentDto, cardId, userId);
  }

  @Get()
  findAll(@Request() req) {
    const cardId: number = this.cardId;
    return this.commentService.findAll(cardId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @Request() req) {
    const cardId: number = this.cardId;
    const userId = req.user.id;
    return this.commentService.findOne(+id, cardId);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Request() req, @Body() updateCommentDto: UpdateCommentDto) {
    const cardId: number = this.cardId;
    const userId = req.user.id;
    return this.commentService.update(+id, updateCommentDto, cardId);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    const cardId: number = this.cardId;
    const userId = req.user.id;
    return this.commentService.remove(+id, cardId);
  }
}
