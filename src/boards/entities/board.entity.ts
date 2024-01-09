import { IsNotEmpty, IsString } from 'class-validator';
import { List } from 'src/list/entities/list.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('increment')
  id: number;

  /**
   * 보드 관리자
   * @example 1
   */
  @IsNotEmpty({ message: '보드 생성자를 입력해주세요.' })
  @IsString()
  @Column()
  boardOwner: number;

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
   * 리스트 배열
   * @example [1,2,3]
   */
  @Column('simple-array')
  orderList: number[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // N : 1
  @ManyToOne(() => User)
  user: User;

  @OneToMany((type) => List, (list) => list.board, {})
  lists: List[];
}
