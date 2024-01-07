import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { OrderChangeCardDto } from './dto/order-change-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { userInfo } from 'os';
import { CreateCard, CreateCardFail, DeleteCard } from './types/res.types';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  //카드 생성하기
  async create(
    createCardDto: CreateCardDto,
    columnId: number,
    user: object,
  ): Promise<CreateCard | CreateCardFail> {
    //user타입 추후 User로 변경 예정

    try {
      //컬럼 레포지토리에서 컬럼 아이디에 해당하는 데이터 목록 불러온 후,
      //그것의 길이 -1 을 order의 값으로 넣어주기.

      // const createCard = await this.cardRepository.save({
      //   ...createCardDto,
      //   order: findCardArr.length - 1,
      //   writer: user.name,
      //   userId: user.id,
      //   columnId,
      // });

      const { allowMembers } = createCardDto;

      for (let member of allowMembers) {
        //user 테이블에서 존재하는 사용자 인지 조회하기
        //만약 없다면 에러 발생하고 break처리로 반복문 끝내기.
      }

      const createCard = await this.cardRepository.save({
        ...createCardDto,
        order: 1,
        writer: '김동동',
        userId: 1,
        columnId,
      });

      return {
        success: true,
        message: '카드 생성을 완료했습니다.',
        data: createCard,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: '카드 생성을 다시 시도해주세요.',
      };
    }
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  //카드 수정하기
  async update(
    id: number,
    updateCardDto: UpdateCardDto,
  ): Promise<CreateCard | CreateCardFail> {
    const { cardName, cardDescription, cardColor, allowMembers, order } =
      updateCardDto;
    let changeOrder = order;
    try {
      const findCard = await this.cardRepository.findOne({ where: { id } });
      if (findCard.order !== order) {
        //카드 순서를 바꿀때 바꾸려는 순서 번호를 dto로 넘긴다고 생각.
        //바꾸려는 카드 칮기.
        const findChangeCard = await this.cardRepository.findOne({
          where: { order: order },
        });
        changeOrder = findChangeCard.order;
        findChangeCard.order = findCard.order;
        await this.cardRepository.save(findChangeCard);
      }
      findCard.cardName = cardName;
      findCard.cardDescription = cardDescription;
      findCard.cardColor = cardColor;
      findCard.allowMembers = allowMembers;
      findCard.order = changeOrder;
      const updateCard = await this.cardRepository.save(findCard);

      return {
        success: true,
        message: '카드 수정을 완료했습니다.',
        data: updateCard,
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 500,
        message: '카드 수정을 다시 시도해주세요.',
      };
    }
  }

  //카드 순서 변경하기
  async moveCard(
    cardId: number,
    orderChangeCardDto: OrderChangeCardDto,
  ): Promise<CreateCard | CreateCardFail> {
    try {
      // const { order, columnId } = orderChangeCardDto;
      // const findCard = await this.cardRepository.findOne({
      //   where: { id: cardId },
      // });
      // const sameColumnId = findCard.columnId === columnId;
      // const sameCardOrderId = findCard.order === order;

      // if (sameColumnId && sameCardOrderId) {
      //   //변경사항이 없음
      // } else if (sameColumnId && !sameCardOrderId) {
      //   //컬럼은 그대로, 카드순서만 변경되었음.
      // } else {
      //   //컬럼이 변경되었음.
      //   //해당 컬럼에 들어있는 카드의 길이-1번을 order필드에 삽입.
      // }

      return;
    } catch (err) {
      console.log(err);
    }
  }

  async remove(id: number): Promise<DeleteCard | CreateCardFail> {
    try {
      await this.cardRepository.delete({ id });
      return {
        success: true,
        message: '해당 카드삭제가 정상적으로 처리되었습니다.',
      };
    } catch (err) {
      console.log(err);
      return {
        success: false,
        status: 400,
        message: '카드삭제를 다시 시도해주세요.',
      };
    }
  }
}
