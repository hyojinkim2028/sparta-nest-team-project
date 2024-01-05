import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 이메일
   * @example "example@email.com"
   */
  @ApiProperty()
  @IsEmail({}, { message: '이메일 형식이 맞지 않습니다.' })
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  /**
   * 이름
   * @example "홍길동"
   */
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: '이름을 입력해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  name: string;

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
  @Column({ type: 'varchar', select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
