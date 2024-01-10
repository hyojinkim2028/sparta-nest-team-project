// import { User } from 'src/user/entities/user.entity';
// import { Card } from 'src/card/entities/card.entity';
import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  // JoinColumn,
  // ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column({ nullable: false })
  card_id: number;

  @IsNumber()
  @Column({ nullable: false })
  user_id: number;

  @IsString()
  @Column('varchar', { length: 255, nullable: false })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  // @ManyToOne(() => Card, (card) => card.comments)
  // @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  // card: Card;

  // @ManyToOne(() => User, (user) => user.comments)
  // @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  // user: User;
}
