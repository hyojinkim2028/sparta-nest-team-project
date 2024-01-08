import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvitationStatus } from '../types/invite-invitationStatus.type';

@Entity('invite')
export class Invite {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: InvitationStatus, default: 'Pending' })
  invitationStatus: InvitationStatus;

  @ManyToOne(() => Board, (board) => board.invite)
  board: Board;

  @JoinColumn({ name: 'invitedPerson' })
  @ManyToOne(() => User)
  user: User;
}
