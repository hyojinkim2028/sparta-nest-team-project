import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 보드생성
  async create(userId: number, createBoardDto: CreateBoardDto) {
    const { boardTitle, description, backgroundColor } = createBoardDto;

    const board = await this.boardsRepository.save({
      boardOwner: userId,
      boardTitle,
      description,
      backgroundColor,
      orderList: [],
      user: {
        id: userId,
      },
    });
    return board;
  }

  // 해당 유저의 보드 전체 조회
  async findAll(userId: number) {
    const boards = await this.boardsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: ['boardTitle'],
    });
    return boards;
  }

  // 보드 상세조회
  async findOne(id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });
    return board;
  }

  // 영화 수정
  async update(userId: number, id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    // 권한 여부 확인, 보드 생성자가 아닐시 리턴
    if (board.boardOwner !== userId) {
      throw new ForbiddenException('관리자에게 권한이 있습니다');
    }

    const { ...data } = updateBoardDto;

    const updatedBoard = this.boardsRepository.save({
      ...board,
      ...data,
    });
    return updatedBoard;
  }

  async remove(userId: number, id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    // 권한 여부 확인, 보드 생성자가 아닐시 리턴
    if (board.boardOwner !== userId) {
      throw new ForbiddenException('관리자에게 권한이 있습니다');
    }

    return board;
  }
}
