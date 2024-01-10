import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginOrNotGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (canActivate) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    request.user = null; // 사용자가 없음을 명시
    return true; // 인증되지 않았어도 접근을 허용
  }
}
