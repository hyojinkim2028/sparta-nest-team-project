import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Page } from './decorators/page.decorator';
import { UserInfo } from './utils/userInfo.decorator';
import { User } from './user/entities/user.entity';
import { LoginOrNotGuard } from './auth/guards/optional.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(LoginOrNotGuard)
  @Get('home')
  @Page('main')
  async hello(@UserInfo() user: User) {
    return {
      user,
      message:
        '홈입니다. 로그인 했을때는 보드리스트가 나오고, 아니면 가입 독촉페이지',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/register')
  @Page('register')
  async regFront(@UserInfo() user: User) {
    return {
      user,
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다. 로그인도 마찬가지',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/team')
  @Page('teamInfo')
  async teamInfo(@UserInfo() user: User) {
    return {
      user,
      message: '팀 소개',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/code')
  @Page('codeIntro')
  async codeIntro(@UserInfo() user: User) {
    return {
      user,
      message: '코드소개',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/project')
  @Page('project')
  async projectInfo(@UserInfo() user: User) {
    return {
      user,
      message: '프로젝트 소개',
    };
  }
  @UseGuards(LoginOrNotGuard)
  @Get('/plan')
  @Page('plan')
  async planInfo(@UserInfo() user: User) {
    return {
      user,
      message: '프로젝트 플랜',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/info')
  @Page('myInfo')
  async GetUserInfo(@UserInfo() user: User) {
    return {
      user,
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다. 로그인도 마찬가지',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/board/:boardId')
  @Page('boardInfo')
  async boardInfo(@UserInfo() user: User, @Req() req) {
    return {
      user,
      message: '보드상세!!',
    };
  }

  @UseGuards(LoginOrNotGuard)
  @Get('/boardModal')
  @Page('createBoardModal')
  async createBoardModal(@UserInfo() user: User, @Req() req) {
    return {
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다.',
    };
  }
}
