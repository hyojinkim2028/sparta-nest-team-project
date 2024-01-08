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
import { Board } from 'src/boards/entities/board.entity';

@Entity('lists')
export class List {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column()
  boardId: number;

  /**
   * 리스트 이름
   * @example "Done"
   */
  @IsNotEmpty({ message: '리스트 명을 입력해 주세요.' })
  @IsString()
  @Column()
  listTitle: string;

  /**
   * 카드 순서
   * @example "[1,2,3,4,5]"
   */
  @Column({ type: 'simple-array' })
  cardOrder: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne((type) => Board, (board) => board.lists, { onDelete: 'CASCADE' })
  board: Board;

  // @OneToMany((type) => Card, (card) => card.list, {})
  // cards: Card[];
}
