import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const { boardTitle, description, backgroundColor, userList } =
      createBoardDto;

    const board = await this.boardRepository.save({
      boardTitle,
      description,
      backgroundColor,
      userList,
    });

    return board;
  }

  findAll() {
    return `This action returns all boards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
