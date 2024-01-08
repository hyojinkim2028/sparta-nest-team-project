import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('보드')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  /**
   *
   * @param 보드 생성
   * @returns
   */
  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    const data = await this.boardsService.create(createBoardDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '보드 생성에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 보드 전체 조회
   * @returns
   */
  @Get()
  findAllBoards() {
    return this.boardsService.findAll();
  }

  /**
   *
   * @param 보드 상세 조회
   * @returns
   */
  @Get(':id')
  findOneBoard(@Param('id') id: string) {
    return this.boardsService.findOne(+id);
  }

  /**
   *
   * @param 보드 수정
   * @returns
   */
  @Patch(':id')
  updateBoard(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
    return this.boardsService.update(+id, updateBoardDto);
  }

  /**
   *
   * @param 보드 삭제
   * @returns
   */
  @Delete(':id')
  removeBoard(@Param('id') id: string) {
    return this.boardsService.remove(+id);
  }
}
