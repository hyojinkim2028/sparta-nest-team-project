import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCardDto extends PickType(CreateCardDto, [
  'cardName',
  'cardDescription',
  'cardColor',
  'allowMembers',
  'workers',
  'startDate',
  'endDate',
  'endTime',
]) {
  // @ApiProperty({ required: true, example: '순서를 바꿀 카드를 선택해 주세요' })
  // @IsString({
  //   message: '보드순서번호-컬럼순서번호-카드순서번호 를 입력해 주세요.',
  // })
  // order: string;
}
