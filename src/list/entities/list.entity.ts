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
import { IsNotEmpty, IsString } from 'class-validator';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true })
  boardId: number;

  /**
   * 리스트 이름
   * @example "Done"
   */
  @IsNotEmpty({ message: '리스트 명을 입력해 주세요.' })
  @IsString()
  listTitle: string;

  /**
   * 카드 순서
   * @example "[1,2,3,4,5]"
   */
  cardOrder: number[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne((type) => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  board: Board;

  @OneToMany((type) => Card, (card) => card.list, {})
  cards: Card[];
}
