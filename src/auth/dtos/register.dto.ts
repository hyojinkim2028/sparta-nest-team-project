import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class RegisterDto extends PickType(User, ['email', 'password', 'name']) {
  /**
   * 비밀번호
   * @example "123123"
   */
  @ApiProperty()
  @IsNotEmpty({ message: '비밀번호를 입력해주세요.' })
  // @IsStrongPassword(
  //   {},
  //   {
  //     message:
  //       '비밀번호는 영문 알파벳 대,소문자, 숫자, 특수문자를 포함해야합니다.',
  //   },
  // )
  @IsString()
  passwordConfirm: string;
}
