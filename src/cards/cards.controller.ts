import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { OrderChangeCardDto } from './dto/order-change-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import {
  AllCardsInOneList,
  CreateCard,
  CreateCardFail,
  DeleteCard,
} from './types/res.types';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  //카드 생성하기
  @Post('list/:listId') //listId가 들어갑니다.
  async create(
    @Body() createCardDto: CreateCardDto,
    @Param('listId') listId: number,
    @UserInfo() user: User,
  ): Promise<CreateCard | CreateCardFail> {
    console.log('listId', listId);
    const createCard = await this.cardsService.create(
      createCardDto,
      listId,
      user,
    );
    return createCard;
  }

  // 해당 리스트에 속하는 모든 카드 조회하기.
  @Get('list/:listsId') //listsId
  async allCardsInOneList(
    @Param('listsId') listsId: number,
    @UserInfo() user: User,
  ): Promise<AllCardsInOneList | CreateCardFail> {
    return await this.cardsService.allCardsInOneList(+listsId, user);
  }

  //특정 카드 조회
  @Get(':id') //cardId
  async cardDetail(
    @Param('id') cardId: number,
    @UserInfo() user: User,
  ): Promise<CreateCard | CreateCardFail> {
    return await this.cardsService.cardDetail(+cardId, user);
  }

  //카드 수정하기
  @Patch(':id') //cardId
  async update(
    @Param('id') cardId: number,
    @Body() updateCardDto: UpdateCardDto,
    @UserInfo() user: User,
  ): Promise<CreateCard | CreateCardFail> {
    return await this.cardsService.update(+cardId, updateCardDto, user);
  }

  @Delete(':id') //cardId
  async remove(
    @Param('id') cardId: number,
    @UserInfo() user: User, //: User로 타입 변경 예정.
  ): Promise<DeleteCard | CreateCardFail> {
    return await this.cardsService.remove(+cardId, user);
  }
}
