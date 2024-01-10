import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoardDto } from './dtos/create-board.dto';
import { UpdateBoardDto } from './dtos/update-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Invite } from 'src/invite/entities/invite.entity';
import { InvitationStatus } from 'src/invite/types/invite-invitationStatus.type';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardsRepository: Repository<Board>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  // 보드생성
  async create(userId: number, createBoardDto: CreateBoardDto) {
    const { boardTitle, description, backgroundColor } = createBoardDto;

    const board = await this.boardsRepository.save({
      boardOwner: userId,
      boardTitle,
      description,
      backgroundColor,
      orderList: [],
      user: {
        id: userId,
      },
    });
    return board;
  }

  // 해당 유저의 보드 전체 조회
  async findAll(userId: number) {
    // 해당 유저가 생성한 보드
    const boards = await this.boardsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      select: ['boardTitle'],
    });

    // 초대 승락하여 조인한 보드
    const invitedList = await this.inviteRepository.find({
      where: {
        user: {
          id: userId,
        },
        invitationStatus: InvitationStatus.Accepted,
      },
      relations: ['board'],
    });
    return [...boards, ...invitedList];
  }

  // 보드 상세조회
  async findOne(id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });
    return board;
  }

  // 보드 수정
  async update(userId: number, id: number, updateBoardDto: UpdateBoardDto) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    // 권한 여부 확인, 보드 생성자가 아닐시 리턴
    if (board.boardOwner !== userId) {
      throw new ForbiddenException('관리자에게 권한이 있습니다');
    }

    const { ...data } = updateBoardDto;

    const updatedBoard = this.boardsRepository.save({
      ...board,
      ...data,
    });
    return updatedBoard;
  }

  // 보드 수정
  async updateOrderList(
    userId: number,
    id: number,
    updateBoardDto: UpdateBoardDto,
  ) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });


    const { ...data } = updateBoardDto;

    const updatedBoard = this.boardsRepository.save({
      ...board,
      ...data,
    });
    return updatedBoard;
  }

  async remove(userId: number, id: number) {
    const board = await this.boardsRepository.findOne({
      where: { id },
    });

    // 권한 여부 확인, 보드 생성자가 아닐시 리턴
    if (board.boardOwner !== userId) {
      throw new ForbiddenException('관리자에게 권한이 있습니다');
    }

    return board;
  }

  // 유저 초대
  async createInvite(email: string, boardId: number) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');

    const invitedList = await this.inviteRepository.find({
      where: {
        board: {
          id: boardId,
        },
        invitationStatus: InvitationStatus.Accepted,
      },
      relations: ['user'],
    });

    const invitedEmailList = invitedList.map((invited) => invited.user.email);

    if (invitedEmailList.includes(email))
      throw new BadRequestException('이미 조인중인 유저입니다.');

    const invite = await this.inviteRepository.save({
      user: {
        id: user.id,
      },
      board: {
        id: boardId,
      },
    });
    return invite;
  }

  // 해당 보드에서 초대한 유저(승락대기중) 조회
  async findAllInvite(userId: number, boardId: number) {
    const board = await this.boardsRepository.findOne({
      where: { id: boardId },
    });
    const invitedList = await this.inviteRepository.find({
      where: {
        board: {
          id: boardId,
        },
        invitationStatus: InvitationStatus.Pending,
      },
      relations: ['user'],
    });

    const invitedIdList = invitedList.map((invited) => invited.user.id);

    if (!invitedIdList.includes(userId) && board.boardOwner !== userId)
      throw new ForbiddenException('접근 권한이 없습니다.');

    const invitedEmailList = invitedList.map((invited) => ({
      email: invited.user.email,
    }));

    return invitedEmailList;
  }
}
