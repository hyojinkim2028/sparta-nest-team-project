import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // N : 1
  @ManyToOne(() => User)
  user: User;
}
