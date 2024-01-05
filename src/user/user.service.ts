import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';
import _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  /**회원가입 */
  async register(email: string, password: string, name: string, passwordConfirm: string) {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('이미 사용중인 이메일입니다.');
    }
    /**이게 왜 ===로 해야 가는건지 이해가 안됨 */
    if (password === passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    const hashedPassword = await hash(password, 10);
    await this.userRepository.save({
      name,
      email,
      password: hashedPassword,
    });
  }
  /**로그인 */
  async login(email: string, password: string) {
    const hashedPassword = await hash(password, 10);
    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'name', 'password'],
      where: { email },
    });

    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요.');
    }
    if (hashedPassword === user.password) {
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    }

    const payload = { email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  /**이메일로 정보 조회 */
  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
