import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Page } from './decorators/page.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Page('main')
  async hello() {
    return { message: '프론트!!!!!!!!!' };
  }

  @Get('/boardList')
  @Page('mainBoardList')
  async hihi() {
    return { message: '프론트!!!!!!!!!' };
  }

  @Get('/dd')
  @Page('dragdrop')
  async ddd() {
    return { message: '프론트!!!!!!!!!' };
  }

  @Get('/register')
  @Page('register')
  async regs() {
    return { message: '프론트!!!!!!!!!' };
  }
}
