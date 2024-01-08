import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtPayLoad } from '../interfaces/jwt-payload.interface';
import _ from 'lodash';
import { AuthService } from '../auth.service';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayLoad) {
    const findUser = await this.authService.findByUserId(payload.id);
    if (_.isNil(findUser)) {
      throw new NotFoundException('해당되는 사용자를 찾을 수 없습니다.');
    }
    console.log('jwt findUser', findUser);
    return findUser;

    // return payload;
  }
}
