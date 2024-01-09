import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invite } from './entities/invite.entity';
import { InvitationStatus } from './types/invite-invitationStatus.type';

@Injectable()
export class InviteService {
  constructor(
    @InjectRepository(Invite)
    private readonly inviteRepository: Repository<Invite>,
  ) {}

  // 해당 유저가 받은 초대 조회(아직 승락하지 않은 초대리스트)
  async findAllPending(userId: number) {
    const invitedList = await this.inviteRepository.find({
      where: {
        user: {
          id: userId,
        },
        invitationStatus: InvitationStatus.Pending,
      },
      relations: ['board'],
    });
    return invitedList;
  }

  // 초대 승락 또는 거부
  async update(inviteId: number, invitationStatus: string) {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
    });

    let updatedStatus: InvitationStatus;
    if (invitationStatus === 'Accepted') {
      updatedStatus = InvitationStatus.Accepted;
    } else {
      await this.inviteRepository.remove(invite);
      return '초대를 거절하였습니다.';
    }

    const updatedInvite = await this.inviteRepository.save({
      ...invite,
      invitationStatus: updatedStatus,
    });
    return updatedInvite;
  }

  // 초대 취소 
  async remove(inviteId: number) {
    const invite = await this.inviteRepository.findOne({
      where: { id: inviteId },
    });
    const data = await this.inviteRepository.remove(invite);
    return data;
  }
}
