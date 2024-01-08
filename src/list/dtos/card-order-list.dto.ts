import { PickType } from '@nestjs/swagger';
import { List } from '../entities/list.entity';

export class CardOrderListDto extends PickType(List, ['cardOrder']) {}
