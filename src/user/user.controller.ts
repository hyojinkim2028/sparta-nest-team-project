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
import { Page } from 'src/decorators/page.decorator';
import { Query } from '@nestjs/common';

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
  /**
   * 회원탈퇴
   * @param req
   * @returns
   */
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

  //유저 이름으로 유저 정보 가져오는 로직
  //(카드 생성시 availableMembers를 아이디 배열로 받기 때문에 만들어요)
  /**
   * 이름으로 유저아이디 찾기
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserId(@Query('name') name: string): Promise<object> {
    console.log('name', name);

    const data = await this.userService.findOneByName(name);
    console.log('data컨트롤러', data);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.(이름으로)',
      data,
    };
  }

  //유저 아이디로 유저 정보 가져오는 로직
  //(카드 생성시 availableMembers를 아이디 배열로 받기 때문에 만들어요)
  /**
   * 아이디로 유저정보 찾기
   * @param req
   * @returns
   */
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserName(@Query('id') id: number): Promise<object> {
    const data = await this.userService.findOneById(id);
    console.log('data컨트롤러', data, id);

    return {
      statusCode: HttpStatus.OK,
      message: '내 정보 조회에 성공했습니다.(아이디로)',
      data,
    };
  }
}
