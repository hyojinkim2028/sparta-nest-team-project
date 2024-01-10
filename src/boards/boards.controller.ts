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
  Render,
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
   * @param 보드 전체 조회(본인이 생성한 보드 + 조인중인 보드)
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  @Render('boardList')
  async findAllBoards(@Request() req) {
    const userId = req.user.id;
    const data = await this.boardsService.findAll(userId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '보드 전체조회에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 보드 상세 조회
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOneBoard(@Param('id') id) {
    const data = await this.boardsService.findOne(+id);
    return {
      statusCode: HttpStatus.FOUND,
      message: '보드 상세조회에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 보드 수정
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async updateBoard(
    @Request() req,
    @Param('id') id,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const userId = req.user.id;
    const data = await this.boardsService.update(userId, +id, updateBoardDto);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 수정에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 오더리스트 수정
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/list')
  async updateOrderList(
    @Request() req,
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    const userId = req.user.id;
    const data = await this.boardsService.updateOrderList(
      userId,
      +id,
      updateBoardDto,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '보드 수정에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 보드 삭제
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async removeBoard(@Request() req, @Param('id') id) {
    const userId = req.user.id;
    const data = await this.boardsService.remove(userId, +id);
    return {
      statusCode: HttpStatus.OK,
      message: '보드 삭제에 성공했습니다!',
      data,
    };
  }

  // 유저 초대
  @Post('/:boardId/invite')
  async inviteUser(@Body('email') email, @Param('boardId') boardId) {
    const data = await this.boardsService.createInvite(email, boardId);
    return {
      statusCode: HttpStatus.CREATED,
      message: '유저 초대 완료했습니다!',
      data,
    };
  }

  /**
   *
   * @param 해당 보드에서 초대한 유저 조회(초대후 승락 대기중인 유저)
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('/:boardId/invite')
  async findAllInviteOnPending(@Request() req, @Param('boardId') boardId) {
    const userId = req.user.id;
    const data = await this.boardsService.findAllInvite(userId, boardId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '초대중인 내역 전체 조회에 성공했습니다!',
      data,
    };
  }
}
