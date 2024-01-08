import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('보드')
@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  /**
   *
   * @param 보드 생성
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createBoard(
    @Request() req, //
    @Body() createBoardDto: CreateBoardDto, //
  ) {
    const userId = req.user.id;
    const data = await this.boardsService.create(userId, createBoardDto);
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
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllBoards(@Request() req) {
    const userId = req.user.id;
    return this.boardsService.findAll(userId);
  }

  // /**
  //  *
  //  * @param 보드 상세 조회
  //  * @returns
  //  */
  // @Get(':id')
  // findOneBoard(@Param('id') id: string) {
  //   return this.boardsService.findOne(+id);
  // }

  // /**
  //  *
  //  * @param 보드 수정
  //  * @returns
  //  */
  // @Patch(':id')
  // updateBoard(@Param('id') id: string, @Body() updateBoardDto: UpdateBoardDto) {
  //   return this.boardsService.update(+id, updateBoardDto);
  // }

  // /**
  //  *
  //  * @param 보드 삭제
  //  * @returns
  //  */
  // @Delete(':id')
  // removeBoard(@Param('id') id: string) {
  //   return this.boardsService.remove(+id);
  // }
}
