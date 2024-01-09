import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsJSON, IsNotEmpty, IsString } from 'class-validator';
import { ArrayElement } from 'typeorm';

export class CreateCardDto {
  @ApiProperty({ required: true, example: '카드 제목' })
  @IsNotEmpty({ message: '카드 제목을 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  cardName: string;

  @ApiProperty({ required: true, example: '카드 설명' })
  @IsNotEmpty({ message: '설명을 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  cardDescription: string;

  @ApiProperty({
    example: '접근을 허용할 맴버를 입력해 주세요.',
  })
  @IsNotEmpty({ message: '허용할 멤버를 입력해주세요.' })
  @IsArray()
  allowMembers: number[];

  @ApiProperty({
    example: '작업할 맴버를 입력해 주세요. ex) [1,2]',
  })
  @IsNotEmpty({ message: '작업할 멤버를 입력해주세요.' })
  @IsArray()
  workers: number[];

  @ApiProperty({ required: true, example: '카드 색상' })
  @IsNotEmpty({ message: '카드 색상을 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  cardColor: string;

  @ApiProperty({ required: true, example: '시작 날짜' })
  @IsNotEmpty({ message: '일정 시작 날짜를 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  startDate: string;

  @ApiProperty({ required: true, example: '마감 날짜' })
  @IsNotEmpty({ message: '일정 마감 날짜를 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  endDate: string;

  @ApiProperty({ required: true, example: '마감 시간' })
  @IsNotEmpty({ message: '일정 마감 시간을 입력해주세요.' })
  @IsString({ message: '문자를 입력해 주세요.' })
  endTime: string;
}
