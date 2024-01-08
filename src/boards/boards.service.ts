import { Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(userId: number, createBoardDto: CreateBoardDto) {
    const { boardTitle, description, backgroundColor } = createBoardDto;

    const board = await this.boardRepository.save({
      boardTitle,
      description,
      backgroundColor,
      user: {
        id: userId,
      },
    });
    return board;
  }

  //     // 영화 전체 조회
  //     findAllMovies(): Promise<Movie[]> {
  //       return this.moviesRepository.find({
  //           relations: ['movieCategory'],
  //       });
  //   }

  findAll(userId: number) {
    return this.boardRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['user'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} board`;
  // }

  // update(id: number, updateBoardDto: UpdateBoardDto) {
  //   return `This action updates a #${id} board`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} board`;
  // }
}
