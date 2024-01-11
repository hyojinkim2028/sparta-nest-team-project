import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dtos/login.dto';
import { Response } from 'express';

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
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(registerDto);
    const accessToken = data.accessToken;
    res.cookie('Authorization', accessToken);
    return res.status(HttpStatus.CREATED).json({ accessToken });
  }

  /**
   * 로그인
   * @param req
   * @param loginDto
   * @returns
   */
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Res() res: Response,
  ) {
    const accessToken = this.authService.login(req.user.id);
    res.cookie('Authorization', accessToken.accessToken);

    return res.status(HttpStatus.OK).json({ accessToken });
  }
}
