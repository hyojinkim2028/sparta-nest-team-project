import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    console.log('UserInfo 리퀘스트 쿠키 받는지 확인', req.cookies);
    // 쿠키는 받았으나 쿠키를 해체해서 user 를 보내고 있지 않음 -가드에서 확인 안하는중

    console.log('UserInfo 데코레이터 req.user값 상태', req.user);
    return req.user ? req.user : null;
  },
);
