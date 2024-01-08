// import { User } from 'src/user/entities/user.entity';
// import { Card } from 'src/card/entities/card.entity';
import { IsNumber, IsString } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  //   JoinColumn,
  //   ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'comment',
})
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  @Column()
  card_id: number;

  @IsNumber()
  @Column()
  user_id: number;

  @IsString()
  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  //   @ManyToOne(() => Card, (card) => card.comments)
  //   @JoinColumn({ name: 'card_id', referencedColumnName: 'id' })
  //   card: Card;

  //   @ManyToOne(() => User, (user) => user.comments)
  //   @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  //   user: User;
}
