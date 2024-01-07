import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateCardDto } from './create-card.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCardDto extends PickType(CreateCardDto, [
  'cardName',
  'cardDescription',
  'cardColor',
  'allowMembers',
]) {
  @ApiProperty({ required: true, example: '마감 시간' })
  @IsNotEmpty({ message: '일정 마감 시간을 입력해주세요.' })
  @IsNumber({}, { message: '문자를 입력해 주세요.' })
  order: number;
}
