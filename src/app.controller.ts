import { Controller, Get, Req, UseGuards } from '@nestjs/common';
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
  @UseGuards(AuthGuard('jwt'))
  @Get('home')
  @Page('main')
  async hello(@UserInfo() user: User) {
    console.log('app.컨트롤러에서 user 보내는중', user);

    return {
      user,
      message:
        '홈입니다. 로그인 했을때는 보드리스트가 나오고, 아니면 가입 독촉페이지',
    };
  }

  @Get('/register')
  @Page('register')
  async regFront(@UserInfo() user: User, @Req() req) {
    return {
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다. 로그인도 마찬가지',
    };
  }

  @Get('/info')
  @Page('myInfo')
  async GetUserInfo(@UserInfo() user: User, @Req() req) {
    return {
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다. 로그인도 마찬가지',
    };
  }

  /**이게 맞는지 확인 필요함, 보드 리스트에서 클릭했을때 어느 주소로 가는지 확인 필요함 */
  @Get('/board/:boardId')
  @Page('boardInfo')
  async boardInfo(@UserInfo() user: User, @Req() req) {
    return {
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다.',
    };
  }

  @Get('/boardModal')
  @Page('createBoardModal')
  async createBoardModal(@UserInfo() user: User, @Req() req) {
    return {
      message:
        '평범한 회원가입페이지입니다. 평범하지 않은 모달이 될수도 있습니다.',
    };
  }

  @Get('/test')
  @Page('dragdrop_test')
  async DragAndDrop() {
    return {
      message: '칸반보드 테스트중',
    };
  }
}
