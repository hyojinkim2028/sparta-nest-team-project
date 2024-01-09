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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateListDto } from './dtos/create-list.dto';

@ApiTags('리스트')
// @UseGuards(AuthGuard('jwt'))
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * 리스트 생성
   * @param CreateListDto
   * @returns
   */
  @ApiBearerAuth()
  @Post('/:boardId')
  async create(
    @Param('boardId') boardId: number,
    @Body() createListDto: CreateListDto,
  ) {
    const data = await this.listService.create(boardId, createListDto);
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
  @ApiBearerAuth()
  @Get('/:boardId')
  async findAll(@Param('boardId') boardId: number) {
    const data = await this.listService.findAll(boardId);

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
  @ApiBearerAuth()
  @Patch('/:boardId/:id')
  async update(
    @Param('boardId') boardId: number,
    @Param('id') id: number,
    @Body() createListDto: CreateListDto,
  ) {
    const data = await this.listService.update(boardId, id, createListDto);

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
  @ApiBearerAuth()
  @Delete('/boardId/:id')
  async delete(@Param('boardId') boardId: number, @Param('id') id: number) {
    const data = await this.listService.delete(boardId, id);

    return {
      statusCode: HttpStatus.OK,
      message: '리스트 삭제에 성공했습니다.',
      data,
    };
  }
}
