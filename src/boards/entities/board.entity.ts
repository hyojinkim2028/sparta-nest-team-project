import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * 보드 이름
   * @example "todo"
   */
  @IsNotEmpty({ message: '보드 이름을 입력해주세요.' })
  @IsString()
  @Column()
  boardTitle: string;

  /**
   * 보드 설명
   * @example "해야할일 리스트 보드"
   */
  @IsNotEmpty({ message: '보드 설명을 입력해주세요.' })
  @IsString()
  @Column({ type: 'text' })
  description: string;

  /**
   * 보드 배경 색상
   * @example "#eeeee"
   */
  @IsNotEmpty({ message: '보드 배경색상을 입력해주세요.' })
  @IsString()
  @Column()
  backgroundColor: string;

  /**
   * 보드 사용자 리스트(본인+초대된 사용자들)
   * @example "['rizzy']"
   */
  @IsArray()
  @Column({ type: 'json' })
  userList: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
