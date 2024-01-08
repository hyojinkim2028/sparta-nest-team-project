import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ListService } from './list.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CreateListDto } from './dtos/create-list.dto';

@ApiTags('리스트')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 리스트 생성
   * @param CreateListDto
   * @returns
   */
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createListDto: CreateListDto) {
    const data = await this.listService.create(createListDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '리스트 생성에 성공했습니다.',
      data,
    };
  }

  /**
   * 리스트 조회
   * @returns
   */
  @Get()
  async findAll() {
    const data = await this.listService.findAll();

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 리스트 이름 수정
   * @returns
   */
  // @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: number) {
    const data = await this.listService.update(id);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 리스트 삭제
   * @returns
   */
  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const data = await this.listService.delete(id);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 삭제에 성공했습니다.',
      data,
    };
  }
}
