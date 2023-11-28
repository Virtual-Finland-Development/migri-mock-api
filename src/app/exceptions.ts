abstract class BaseException extends Error {
  constructor(message: any, cause?: { cause?: Error } | Error) {
    let errorCause = cause instanceof Error ? cause : cause?.cause;
    if (message instanceof Error) {
      errorCause = errorCause ?? message;
      super(message.message, { cause: errorCause });
    } else {
      super(message, { cause: errorCause });
    }
  }
}

export class BadRequestException extends BaseException {
  type = "BadRequestException";
  code = 403;
}

export class AccessDeniedException extends BaseException {
  type = "AccessDeniedException";
  code = 403;
}
