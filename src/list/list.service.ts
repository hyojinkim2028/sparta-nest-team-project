import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { CreateListDto } from './dtos/create-list.dto';
import { Board } from 'src/boards/entities/board.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    private readonly dataSource: DataSource,
  ) {}

  async create(boardId: number, { listTitle }: CreateListDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newList = await queryRunner.manager.save(List, {
        boardId,
        listTitle,
      });

      const createdList = await queryRunner.manager.save(List, newList);

      // 기존 보드 가져오기
      const board = await queryRunner.manager.findOneBy(Board, { id: boardId });

      // 보드의 orderList 업데이트
      if (board) {
        const updatedOrderList = board.orderList
          ? [...board.orderList, createdList.id]
          : [createdList.id];

        board.orderList = updatedOrderList;
        await queryRunner.manager.save(Board, board);
      }

      await queryRunner.commitTransaction();
      return createdList;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }

  async findAll(boardId: number) {
    const lists = await this.listRepository.find({
      where: {
        boardId,
      },
    });

    const board = await this.boardRepository.findOneBy({ id: boardId });

    return {
      success: true,
      message: '리스트 조회에 성공했습니다.',
      order_list: board.orderList,
      data: lists,
    };
  }

  async update(boardId: number, id: number, { listTitle }: CreateListDto) {
    if (!listTitle) {
      throw new BadRequestException('수정할 리스트명을 작성해 주세요.');
    }

    const updateList = await this.listRepository.update(
      { boardId, id },
      { listTitle },
    );
  }

  async delete(boardId: number, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const listToRemove = await queryRunner.manager.findOneBy(List, { id });

      if (!listToRemove)
        throw new NotFoundException('해당 리스트를 찾을 수 없습니다.');

      const board = await queryRunner.manager.findOneBy(Board, {
        id: listToRemove.boardId,
      });

      if (!board) throw new NotFoundException('해당 보드를 찾을 수 없습니다.');

      if (board.orderList) {
        board.orderList = board.orderList.filter((idList) => +idList !== id);

        await queryRunner.manager.save(Board, board);
      }
      await queryRunner.manager.softRemove(listToRemove);

      await queryRunner.commitTransaction();
      return listToRemove;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw err;
    }
  }

  //카드 생성 삭제시 필요해서 추가해요!
  async findOneListData(listsId) {
    return await this.listRepository.findOne({
      where: { id: +listsId },
    });
  }
}
