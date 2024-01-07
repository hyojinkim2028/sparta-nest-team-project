import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class OrderChangeCardDto extends PickType(CreateCardDto, []) {
  @ApiProperty({ required: true, example: '카드의 순서' })
  @IsNumber({}, { message: '숫자를 입력해 주세요.' })
  order: number;

  @ApiProperty({
    required: true,
    example: '어떤 컬럼에 해당 카드가 소속되면 좋을지 자유롭게 이동시켜보세요.',
  })
  @IsNumber({}, { message: '숫자를 입력해 주세요.' })
  columnId: number;
}
