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
import { CreateCard, CreateCardFail, DeleteCard } from './types/res.types';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('card')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  //카드 생성하기
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

  // //전체 카드 조회
  // @Get()
  // async findAllCard_() {
  //   await return this.cardsService.findAll();
  // }

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

  // //카드 이동하기(동일컬럼 내부, 다른 컬럼)
  // @Patch('/move-card/:id') //cardId
  // async moveCard(
  //   @Param('id') id: string,
  //   @Body() orderChangeCardDto: OrderChangeCardDto,
  // ): Promise<CreateCard | CreateCardFail> {
  //   return await this.cardsService.moveCard(+id, orderChangeCardDto);
  // }
}
