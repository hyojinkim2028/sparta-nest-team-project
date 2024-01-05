import { AuthGuard } from '@nestjs/passport';
import { LoginDto, RegisterDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserInfo } from './utils/userInfo.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /**회원가입 */
  @Post('register')
  async register(@Body() registerDto: RegisterDto, passwordConfirm: string) {
    return await this.userService.register(
      registerDto.email,
      registerDto.name,
      registerDto.password,
      passwordConfirm,
    );
  }
  /**로그인 */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.userService.login(loginDto.email, loginDto.password);
  }
  /**회원정보조회 */
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  getInfo(@UserInfo() user: User) {
    return { user: user };
  }
}
