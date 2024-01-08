import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async create(cardId: number, createCommentDto: CreateCommentDto) {
    const { content } = createCommentDto;
    return await this.commentRepository.save({ content, card_id: cardId });
  }

  async findAll(cardId: number) {
    return await this.commentRepository.find({
      where: { card_id: cardId, deleted_at: null },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async findOne(cardId: number, commentId: number) {
    return await this.commentRepository.find({
      where: { card_id: cardId, id: commentId, deleted_at: null },
    });
  }

  async update(
    cardId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content } = updateCommentDto;
    return await this.commentRepository.update({ id: commentId }, { content });
  }

  remove(cardId: number, commentId: number) {
    return `This action removes a #${commentId} commentof #${cardId} card`;
  }
}
