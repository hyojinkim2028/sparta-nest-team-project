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
import { CardOrderListDto } from './dtos/card-order-list.dto';

@ApiTags('리스트')
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
      success: true,
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
    return await this.listService.findAll(boardId);
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
      success: true,
      message: '리스트 수정에 성공했습니다.',
      data,
    };
  }

  /**
   * 리스트 삭제
   * @returns
   */
  @ApiBearerAuth()
  @Delete('/:boardId/:id')
  async delete(@Param('boardId') boardId: number, @Param('id') id: number) {
    const data = await this.listService.delete(boardId, id);

    return {
      success: true,
      message: '리스트 삭제에 성공했습니다.',
      data,
    };
  }

  /**
   * 카드 순서 변경
   * @returns
   */
  @ApiBearerAuth()
  @Patch('/boardId/:id')
  async editOrder(
    @Param('boardId') boardId: number,
    @Param('id') id: number,
    @Body() cardOrderListDto: CardOrderListDto,
  ) {
    const data = await this.listService.editOrder(
      boardId,
      id,
      cardOrderListDto,
    );

    return {
      success: true,
      message: '순서가 변경되었습니다.',
      data,
    };
  }
}
