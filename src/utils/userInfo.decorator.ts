import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('UserInfo 데코레이터 req.user', request.user);
    return request.user ? request.user : null;
  },
);

//이진님이 jwt.strategy.ts만들면 거기서 넘긴 유저정보 여기서 req.user에 담아 넘겨줄 예정입니다.
