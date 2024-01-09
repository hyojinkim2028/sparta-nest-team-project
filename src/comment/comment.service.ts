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

  async create(
    cardId: number,
    userId: number,
    createCommentDto: CreateCommentDto,
  ) {
    const { content } = createCommentDto;
    return await this.commentRepository.save({
      card_id: cardId,
      user_id: userId,
      content,
    });
  }

  async findAll(cardId: number) {
    return await this.commentRepository.find({
      where: { card_id: cardId, deleted_at: null },
      select: ['card_id', 'id', 'user_id', 'content'],
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
    userId: number,
    updateCommentDto: UpdateCommentDto,
  ) {
    const { content } = updateCommentDto;
    const updatedComment = await this.commentRepository.update(
      {
        id: commentId,
        card_id: cardId,
        user_id: userId,
      },
      { content },
    );
    return updatedComment.affected;
  }

  async remove(cardId: number, commentId: number, userId: number) {
    const deletedComment = await this.commentRepository.softDelete({
      id: commentId,
      card_id: cardId,
      user_id: userId,
    });
    return deletedComment.affected;
  }
}
