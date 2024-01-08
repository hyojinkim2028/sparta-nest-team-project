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

  create(createCommentDto: CreateCommentDto, cardId: number, userId: number) {
    return 'This action adds a new comment';
  }

  findAll(cardId: number) {
    return `This action returns all comment`;
  }

  findOne(id: number, cardId: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto, cardId: number) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number, cardId: number) {
    return `This action removes a #${id} comment`;
  }
}
