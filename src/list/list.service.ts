import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { CreateListDto } from './dtos/create-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List) private readonly listRepository: Repository<List>,
  ) {}

  async create(boardId: number, { listTitle }: CreateListDto) {
    const newList = await this.listRepository.save({
      boardId,
      listTitle,
    });

    return newList;
  }

  async findAll(boardId: number) {
    const lists = await this.listRepository.find({
      where: {
        boardId,
      },
    });

    return lists;
  }

  async update(boardId: number, id: number, { listTitle }: CreateListDto) {
    if (!listTitle) {
      throw new BadRequestException('수정할 리스트명을 작성해 주세요.');
    }
    console.log(listTitle);

    const updateList = await this.listRepository.update(
      { boardId, id },
      { listTitle },
    );
  }

  async delete(boardId: number, id: number) {
    const deleteList = await this.listRepository.softDelete({ boardId, id });
    console.log(deleteList);
    return deleteList;
  }

  //카드 생성 삭제시 필요해서 추가해요!
  async findOneListData(listsId) {
    return await this.listRepository.findOne({
      where: { id: +listsId },
    });
  }
}
