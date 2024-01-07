import { Card } from '../entities/card.entity';

export type CreateCard = {
  success: boolean;
  message: string;
  data: Card;
};

export type CreateCardFail = {
  success: boolean;
  status: number;
  message: string;
};

export type DeleteCard = {
  success: boolean;
  message: string;
};
