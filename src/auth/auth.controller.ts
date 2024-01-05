import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 회원가입
   * @param registerDto
   * @returns
   */
  @Post('/register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: '회원가입에 성공했습니다.',
      data,
    };
  }

  /**
   * 로그인
   * @param req
   * @param loginDto
   * @returns
   */
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return req.user;
  }
}
