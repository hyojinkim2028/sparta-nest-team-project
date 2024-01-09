import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { User } from 'src/user/entities/user.entity';
import { Invite } from 'src/invite/entities/invite.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, User, Invite])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
