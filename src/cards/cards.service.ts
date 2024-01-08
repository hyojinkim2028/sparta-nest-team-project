import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { OrderChangeCardDto } from './dto/order-change-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { In, Repository } from 'typeorm';
import { userInfo } from 'os';
import { CreateCard, CreateCardFail, DeleteCard } from './types/res.types';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    // @InjectRepository(Column)
    // private columnRepository: Repository<Column>,
  ) {}

  //카드 생성하기
  async create(
    createCardDto: CreateCardDto,
    columnId: number,
    user: User,
  ): Promise<CreateCard | CreateCardFail> {
    try {
      console.log('user', user);
      const { allowMembers, cardName, workers } = createCardDto;
      const findCardName = await this.cardRepository.findOne({
        where: { cardName },
      });
      console.log('findCardName', findCardName);
      if (findCardName) {
        throw new BadRequestException('이미 존재하는 카드의 이름입니다.');
      }
      //컬럼 레포지토리에서 컬럼 아이디에 해당하는 데이터 목록 불러온 후,
      //그것의 길이 -1 을 order의 값으로 넣어주기.
      // const findColumnData = await this.columnRepository.find({
      //   where: { id: columnId },
      // });
      // if (!findColumnData) {
      //   throw new BadRequestException(
      //     '존재하지 않는 컬럼에 카드를 생성할 수 없습니다.',
      //   );
      // }
      // const boardId = findColumnData.boardId
      // const columnOrder = findColumnData.order
      // const cardOrder = findColumnData.length -1

      //user 테이블에서 존재하는 사용자 인지 조회하기 _ allowMembers
      const findAllowMembers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: allowMembers })
        .getMany();
      console.log('findAllowMembers', findAllowMembers);
      if (findAllowMembers.length !== allowMembers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }

      //어차피 allowMembers에 있는 사람들 중에 worker가 있을테니까 workers에 유저들이 실제 존재하는 유저인지 검증은 필요 없는 과정.
      //그렇지만 꼼꼼히 처리하는게 좋다고 생각해서 넣었습니다.
      //user 테이블에서 존재하는 사용자 인지 조회하기 _ workers
      const findWorkers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: workers })
        .getMany();
      console.log('findWorkers', findWorkers);
      if (findWorkers.length !== workers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }

      //실제로 작동하게 될 crard 생성 코드입니다.
      // const createCard = await this.cardRepository.save({
      //   ...createCardDto,
      //   writer: user.name,
      //   userId: user.id,
      //   columnId: findColumnData.id,
      // });
      //   order : boardId +'-' +columnOrder+ '-'+ cardOrder,

      //이것은 임시 데이터 생성용 코드입니다.
      const createCard = await this.cardRepository.save({
        ...createCardDto,
        writer: user.name,
        userId: user.id,
        columnId,
      });

      return {
        success: true,
        message: '카드 생성을 완료했습니다.',
        data: createCard,
      };
    } catch (err) {
      console.log(err);
      return err.response;
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
    cardId: number, //cardId
    updateCardDto: UpdateCardDto,
  ): Promise<CreateCard | CreateCardFail> {
    const {
      cardName,
      cardDescription,
      cardColor,
      allowMembers,
      workers,
      // order,
      startDate,
      endDate,
      endTime,
    } = updateCardDto;
    // let changeOrder = order;
    // console.log('order', order);

    try {
      const findCard = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      if (!findCard) {
        throw new BadRequestException('존재하지 않는 카드입니다.');
      }

      //user 테이블에서 존재하는 사용자 인지 조회하기 _ allowMembers
      const findAllowMembers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: allowMembers })
        .getMany();
      console.log('findAllowMembers', findAllowMembers);
      if (findAllowMembers.length !== allowMembers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }

      //어차피 allowMembers에 있는 사람들 중에 worker가 있을테니까 workers에 유저들이 실제 존재하는 유저인지 검증은 필요 없는 과정.
      //그렇지만 꼼꼼히 처리하는게 좋다고 생각해서 넣었습니다.
      //user 테이블에서 존재하는 사용자 인지 조회하기 _ workers
      const findWorkers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: workers })
        .getMany();
      console.log('findWorkers', findWorkers);
      if (findWorkers.length !== workers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }
      // //카드 순서를 바꿀때
      // if (findCard.order !== order) {
      //   const [boardOrder, columnOrder, cardOrder] = findCard.order.split('-');
      //   const [newBoardOrder, newColumnOrder, newCardOrder] = order.split('-');
      //   if (
      //     boardOrder === newBoardOrder &&
      //     columnOrder === newColumnOrder &&
      //     cardOrder !== newCardOrder
      //   ) {
      //     //바꾸려는 순서 번호를 dto로 넘긴다고 생각 - 바꾸려는 카드 칮기.
      //     const findChangeCard = await this.cardRepository.findOne({
      //       where: { order }, //순서를 맞바꾸려는 카드에 데이터 찾기.
      //     });
      //     console.log('findChangeCard', findChangeCard);
      //     changeOrder = findChangeCard.order;
      //     findChangeCard.order = findCard.order;
      //     await this.cardRepository.save(findChangeCard);
      //   }
      // }

      // findCard.order = changeOrder;
      // findCard.id
      // findCard.cardName = cardName;
      // findCard.cardDescription = cardDescription;
      // findCard.cardColor = cardColor;
      // findCard.allowMembers = allowMembers;
      // findCard.workers = workers;
      // findCard.startDate = startDate;
      // findCard.endDate = endDate;
      // findCard.endTime = endTime;

      const updateCard = await this.cardRepository.save({
        id: findCard.id,
        cardName,
        cardDescription,
        cardColor,
        allowMembers,
        workers,
        startDate,
        endDate,
        endTime,
        // order: changeOrder,
      });

      return {
        success: true,
        message: '카드 수정을 완료했습니다.',
        data: updateCard,
      };
    } catch (err) {
      console.log(err);
      return err.response;
    }
  }

  // //카드 순서 변경하기
  // async moveCard(
  //   cardId: number,
  //   orderChangeCardDto: OrderChangeCardDto,
  // ): Promise<CreateCard | CreateCardFail> {
  //   try {
  //     // const { order, columnId } = orderChangeCardDto;
  //     // const findCard = await this.cardRepository.findOne({
  //     //   where: { id: cardId },
  //     // });
  //     // const sameColumnId = findCard.columnId === columnId;
  //     // const sameCardOrderId = findCard.order === order;

  //     // if (sameColumnId && sameCardOrderId) {
  //     //   //변경사항이 없음
  //     // } else if (sameColumnId && !sameCardOrderId) {
  //     //   //컬럼은 그대로, 카드순서만 변경되었음.
  //     // } else {
  //     //   //컬럼이 변경되었음.
  //     //   //해당 컬럼에 들어있는 카드의 길이-1번을 order필드에 삽입.
  //     // }

  //     return;
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  //카드 삭제하기_ 작성자만 카드 삭제가 가능합니다.
  async remove(
    cardId: number,
    user: User,
  ): Promise<DeleteCard | CreateCardFail> {
    try {
      const findWriter = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      console.log('findWriter', findWriter);
      if (!findWriter) {
        throw new BadRequestException('존재하지 않는 카드입니다.');
      }
      if (findWriter.userId !== user.id) {
        throw new UnauthorizedException(
          '작성자가 아님으로 삭제할 수 없습니다.',
        );
      }
      await this.cardRepository.delete({ id: cardId });
      return {
        success: true,
        message: '해당 카드삭제가 정상적으로 처리되었습니다.',
      };
    } catch (err) {
      console.log(err);
      return err.response;
    }
  }
}
