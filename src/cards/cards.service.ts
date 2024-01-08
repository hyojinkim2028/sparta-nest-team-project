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
import { DataSource, In, Repository } from 'typeorm';
import { userInfo } from 'os';
import {
  AllCardsInOneList,
  CreateCard,
  CreateCardFail,
  DeleteCard,
} from './types/res.types';
import { User } from 'src/user/entities/user.entity';
import { todo } from 'node:test';
import { List } from 'src/list/entities/list.entity';
import { ListService } from 'src/list/list.service';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private listService: ListService,
    private dataSource: DataSource,
  ) {}

  //카드 생성하기_ +리스트 테이블에 order배열에 추가하기
  async create(
    createCardDto: CreateCardDto,
    listsId: number,
    user: User,
  ): Promise<CreateCard | CreateCardFail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const { allowMembers, cardName, workers } = createCardDto;

      //카드의 이름은 유니크 해야 합니다.
      const findCardName = await queryRunner.manager
        .getRepository(Card)
        .findOne({
          where: { cardName, listsId: listsId },
        });
      if (findCardName) {
        throw new BadRequestException('이미 존재하는 카드의 이름입니다.');
      }

      //컬럼 레포지토리에서 컬럼 아이디에 해당하는 데이터 목록 불러온 후,
      const findListData = await this.listService.findOneListData(+listsId);
      if (!findListData) {
        throw new BadRequestException(
          '존재하지 않는 컬럼에 카드를 생성할 수 없습니다.',
        );
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

      //workers에 유저들이 실제 존재하는 유저인지 검증_ 꼼꼼히 처리하는게 좋다고 생각해서 넣었습니다.
      const findWorkers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: workers })
        .getMany();
      console.log('findWorkers', findWorkers);
      if (findWorkers.length !== workers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }

      const createCard = await queryRunner.manager.getRepository(Card).save({
        ...createCardDto,
        writer: user.name,
        userId: user.id,
        listsId: findListData.id,
      });
      //list테이블에 카드순서 데이터 수정
      const changeCardIdToString = createCard.id.toString();
      findListData.cardOrder.push(changeCardIdToString);
      await queryRunner.manager.getRepository(List).save(findListData);

      await queryRunner.commitTransaction();
      return {
        success: true,
        message: '카드 생성을 완료했습니다.',
        data: createCard,
      };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err.response;
    } finally {
      await queryRunner.release();
    }
  }

  //해당 컬럼에 속하는 모든 카드 보기
  async allCardsInOneList(
    listsId: number,
    user: User,
  ): Promise<AllCardsInOneList | CreateCardFail> {
    try {
      //해당 리스트 아이디가 존재하는지 검증.
      const allCardsInOneList = await this.cardRepository.find({
        where: { listsId },
      });
      if (!allCardsInOneList) {
        throw new BadRequestException('존재하지 않는 리스트 입니다.');
      }

      //현재 접근하는 유저가 카드에 접근을 허용한 allowMember중 한명인가?
      const filterCardList = allCardsInOneList.filter((data) => {
        return data.allowMembers.map((e) => +e).includes(user.id);
      });

      return {
        success: true,
        message:
          '리스트에 속한 모든 카드 중 유저에게 허용된 모든 카드조회를 완료했습니다.',
        data: filterCardList,
      };
    } catch (err) {
      console.log(err);
      return err.response;
    }
  }

  //카드 상세보기
  async cardDetail(
    cardId: number,
    user: User,
  ): Promise<CreateCard | CreateCardFail> {
    try {
      const findCardDetail = await this.cardRepository.findOne({
        where: { id: +cardId },
      });
      if (!findCardDetail) {
        throw new BadRequestException('존재하지 않는 카드입니다.');
      }
      const allowMembers = findCardDetail.allowMembers
        .map((e) => +e)
        .includes(user.id);
      if (!allowMembers) {
        throw new UnauthorizedException('접근 권한이 없습니다. ');
      }
      return {
        success: true,
        message: '카드 상세정보 조회를 완료했습니다.',
        data: findCardDetail,
      };
    } catch (err) {
      console.log(err);
      return err.response;
    }
  }

  //카드 수정하기 __ 작업자만 수정이 가능합니다.
  async update(
    cardId: number,
    updateCardDto: UpdateCardDto,
    user: User,
  ): Promise<CreateCard | CreateCardFail> {
    const {
      cardName,
      cardDescription,
      cardColor,
      allowMembers,
      workers,
      startDate,
      endDate,
      endTime,
    } = updateCardDto;

    try {
      const findCard = await this.cardRepository.findOne({
        where: { id: cardId },
      });
      if (!findCard) {
        throw new BadRequestException('존재하지 않는 카드입니다.');
      }

      const availableUser = findCard.workers.map((e) => +e).includes(user.id);
      if (!availableUser) {
        throw new UnauthorizedException('수정 권한이 주어지지 않았습니다.');
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

      //workers에 유저들이 실제 존재하는 유저인지 검증_ 꼼꼼히 처리하는게 좋다고 생각해서 넣었습니다.
      const findWorkers = await this.userRepository
        .createQueryBuilder('user')
        .select('user.id')
        .andWhere('user.id IN (:...ids)', { ids: workers })
        .getMany();
      console.log('findWorkers', findWorkers);
      if (findWorkers.length !== workers.length) {
        throw new BadRequestException('지정하신 사용자는 없는 사용자 입니다.');
      }

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

  //카드 삭제하기_ 작성자만 카드 삭제가 가능합니다.
  async remove(
    cardId: number,
    user: User,
  ): Promise<DeleteCard | CreateCardFail> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('READ COMMITTED');

    try {
      const findWriter = await queryRunner.manager.getRepository(Card).findOne({
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

      //리스트 테이블에 cardOrder필드 변경해주기
      const findListData = await this.listService.findOneListData(
        +findWriter.listsId,
      );
      const newCardOrder = findListData.cardOrder.filter(
        (e) => +e !== findWriter.id,
      );
      findListData.cardOrder = newCardOrder;
      await queryRunner.manager.getRepository(List).save(findListData);

      await queryRunner.manager.getRepository(Card).delete({ id: cardId });

      await queryRunner.commitTransaction();
      return {
        success: true,
        message: '해당 카드삭제가 정상적으로 처리되었습니다.',
      };
    } catch (err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
      return err.response;
    } finally {
      await queryRunner.release();
    }
  }
}
