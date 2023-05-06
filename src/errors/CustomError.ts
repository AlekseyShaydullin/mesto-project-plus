// eslint-disable-next-line import/no-import-module-exports
import HttpStatusCode from '../utils/constants';

export interface IError extends Error {
  statusCode?: number;
}

class CustomError extends Error implements IError {
  public statusCode: number;

  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }

  static NotFoundError(message: string) {
    return new CustomError(HttpStatusCode.NOT_FOUND, message);
  }

  static Unauthorized(message: string) {
    return new CustomError(HttpStatusCode.UNAUTHORIZED, message);
  }

  static BadRequest(message: string) {
    return new CustomError(HttpStatusCode.BAD_REQUEST, message);
  }

  static Conflict(message: string) {
    return new CustomError(HttpStatusCode.CONFLICT, message);
  }
}

module.exports = CustomError;
