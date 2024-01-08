import { Card } from '../entities/card.entity';

export type CreateCard = {
  success: boolean;
  message: string;
  data: Card;
};

export type CreateCardFail = {
  message: string;
  error: string;
  statusCode: number;
};

export type DeleteCard = {
  success: boolean;
  message: string;
};

export type AllCardsInOneList = {
  success: boolean;
  message: string;
  data: Card[];
};
