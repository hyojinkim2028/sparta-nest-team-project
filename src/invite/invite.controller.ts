import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('초대')
@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   *
   * @param 받은 초대 리스트(아직 승락하지 않은 초대리스트)
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllInviteOnPending(@Request() req) {
    const userId = req.user.id;
    const data = await this.inviteService.findAllPending(userId);
    return {
      statusCode: HttpStatus.FOUND,
      message: '초대된 내역 전체 조회에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 받은 초대 거절/승락하는 경우
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Patch(':inviteId')
  async updateInvite(
    @Param('inviteId') inviteId: number,
    @Body('invitationStatus') invitationStatus,
  ) {
    const data = await this.inviteService.update(inviteId, invitationStatus);
    return {
      statusCode: HttpStatus.OK,
      message: '초대된 내역 거절/수락에 성공했습니다!',
      data,
    };
  }

  /**
   *
   * @param 초대 취소
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Delete(':inviteId')
  async removeInvite(@Param('inviteId') inviteId) {
    await this.inviteService.remove(+inviteId);
    return {
      statusCode: HttpStatus.OK,
      message: '요청하신 초대 내역 삭제에 성공했습니다.!',
    };
  }
}
