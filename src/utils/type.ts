import { Request } from 'express';

export interface RequestCustom extends Request {
  user?: {
    _id: string;
  };
}

export interface IError {
  status: number;
  message: string;
}
