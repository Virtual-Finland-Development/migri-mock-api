abstract class BaseException extends Error {
  constructor(message: any) {
    if (message instanceof Error) {
      super(message.message, { cause: message });
    } else {
      super(message);
    }
  }
}
export class BadRequestException extends BaseException {}

export class AccessDeniedException extends BaseException {}
