import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true })
  cardName: string;

  @Column({ type: 'varchar', nullable: false })
  cardDescription: string;

  @Column({ type: 'simple-array', nullable: true })
  allowMembers: number[];

  @Column({ type: 'varchar', nullable: false })
  cardColor: string;

  @Column({ type: 'varchar', nullable: false })
  startDate: string;

  @Column({ type: 'varchar', nullable: false })
  endDate: string;

  @Column({ type: 'varchar', nullable: false })
  endTime: string;

  @Column({ type: 'int', nullable: false, unsigned: true })
  order: number;

  //외래키 가져오는 부분 실제 user 테이블과 테스트
  @Column()
  writer: string;

  //추후 comment 테이블 생기면 연결.
  // @OneToMany(() => Comment, (comment) => comment.card, { cascade: true })
  // comment: Comment[];

  // TODO req.user에 담기는데 굳이 user.name을 가져와야 할까?
  //// User 테이블과 연결
  // @ManyToOne(()=> User, (user)=>user.card, { onDelete: 'CASCADE'})
  // @JoinColumn()
  // user: UserActivation;
  // @Column({type: 'int', unsigned: true})
  // userId: number;

  //// Column 테이블과 연결
  // @ManyToOne(()=> Column, (column)=>column.card, { onDelete: 'CASCADE'})
  // @JoinColumn()
  // column: Column;
  // @Column({type: 'int', unsigned: true})
  // columnId: number;
}
