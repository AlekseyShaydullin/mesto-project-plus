import { IError } from '../utils/type';
import CODE from '../utils/constants';

const serverError = (status: number, message: string): IError => ({ status, message });

const badRequestError = (message: string): IError => serverError(CODE.BAD_REQUEST, message);
const authorizationError = (message: string): IError => serverError(CODE.UNAUTHORIZED, message);
const notFoundError = (message: string): IError => serverError(CODE.NOT_FOUND, message);
const internalError = (message: string): IError => serverError(CODE.INTERNAL_SERVER_ERROR, message);

export default {
  badRequestError,
  authorizationError,
  notFoundError,
  internalError,
};
