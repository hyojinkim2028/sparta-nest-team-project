import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dtos/changepassword.dto';

@ApiTags('사용자')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 내 정보 조회
   * @param req
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  async myInfo(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.findOneById(userId);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.',
      data,
    };
  }

  /**
   * 비밀번호 수정
   * @param changePasswordDto
   * @returns
   */
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('info')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id;
    const data = await this.userService.changePassword(
      changePasswordDto,
      userId,
    );
    return {
      statusCode: HttpStatus.OK,
      message: '비밀번호가 수정되었습니다.',
      data,
    };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Put('delete')
  async deleteUser(@Request() req) {
    const userId = req.user.id;
    const data = await this.userService.deleteUser(userId);
    return {
      statusCode: HttpStatus.ACCEPTED,
      message: '회원삭제되었습니다.',
      data,
    };
  }
}
