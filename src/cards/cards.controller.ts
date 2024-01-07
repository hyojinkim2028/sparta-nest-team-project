import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { OrderChangeCardDto } from './dto/order-change-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './entities/card.entity';
import { UserInfo } from 'src/utils/userInfo.decorator';
import { CreateCard, CreateCardFail, DeleteCard } from './types/res.types';
import { User } from 'src/user/entities/user.entity';

@Controller('card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post('column/:columnId') //columnId가 들어갑니다.
  async create(
    @Body() createCardDto: CreateCardDto,
    @Param() columnId: number,
    @UserInfo() user: User,
  ): Promise<CreateCard | CreateCardFail> {
    const createCard = await this.cardsService.create(
      createCardDto,
      columnId,
      user,
    );
    return createCard;
  }

  //전체 카드 조회
  @Get()
  findAll() {
    return this.cardsService.findAll();
  }

  //특정 카드 조회
  @Get(':id') //cardId
  findOne(@Param('id') id: string) {
    return this.cardsService.findOne(+id);
  }

  //카드 수정하기
  @Patch(':id') //cardId
  async update(
    @Param('id') id: string,
    @Body() updateCardDto: UpdateCardDto,
  ): Promise<CreateCard | CreateCardFail> {
    return await this.cardsService.update(+id, updateCardDto);
  }

  //카드 이동하기(동일컬럼 내부, 다른 컬럼)
  @Patch('/move-card/:id') //cardId
  async moveCard(
    @Param('id') id: string,
    @Body() orderChangeCardDto: OrderChangeCardDto,
  ): Promise<CreateCard | CreateCardFail> {
    return await this.cardsService.moveCard(+id, orderChangeCardDto);
  }

  @Delete(':id') //cardId
  async remove(
    @Param('id') id: string,
    @UserInfo() user: object, //: User로 타입 변경 예정.
  ): Promise<DeleteCard | CreateCardFail> {
    return await this.cardsService.remove(+id);
  }
}
