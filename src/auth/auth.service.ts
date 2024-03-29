import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from './dtos/register.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  /**회원가입 */
  async register({ name, email, password, passwordConfirm }: RegisterDto) {
    const isPasswordMatched = password === passwordConfirm;
    if (!isPasswordMatched) {
      throw new BadRequestException(
        '비밀번호와 확인용 비밀번호가 일치하지 않습니다.',
      );
    }
    const existedUser = await this.userRepository.findOneBy({ email });
    if (existedUser) {
      throw new BadRequestException('이미 사용중인 이메일입니다.');
    }

    const hashRounds = this.configService.get<number>('PASSWORD_HASH_ROUNDS');
    const hashedPassword = bcrypt.hashSync(password, hashRounds);
    const user = await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
    });

    return this.login(user.id);
  }
  /**로그인 */
  login(userId: number) {
    const payload = { id: userId };
    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  /**로그인 확인 */
  async validateUser({ email, password }: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id: true, password: true },
    });
    const isPasswordMatched = bcrypt.compareSync(
      password,
      user?.password ?? '',
    );
    if (!user || !isPasswordMatched) {
      return null;
    }
    return { id: user.id };
  }

  //jwt.strategy.ts 파일에 유저 정보 넘겨주기 위한 함수
  async findByUserId(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }
}
