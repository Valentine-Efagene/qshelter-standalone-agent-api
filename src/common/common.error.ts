import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { failResponse } from './common.dto';

// ---------------------------------------------------------------------------
// Global HTTP exception filter — converts HttpException to standard shape
// ---------------------------------------------------------------------------
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    let errors: string[] | undefined;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const body = exceptionResponse as Record<string, any>;
      // NestJS ValidationPipe sets `message` as an array of field errors
      if (Array.isArray(body.message)) {
        message = 'Validation failed';
        errors = body.message as string[];
      } else {
        message = (body.message as string) ?? exception.message;
      }
    } else {
      message = exception.message;
    }

    response.status(status).json(failResponse(message, errors));
  }
}

// ---------------------------------------------------------------------------
// MySQL / TypeORM query-failure filter
// https://dev.mysql.com/doc/mysql-errors/8.0/en/server-error-reference.html
// ---------------------------------------------------------------------------
@Catch(QueryFailedError)
export class QueryFailedFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    switch (exception.code) {
      case 'ER_DUP_ENTRY':
        response.status(HttpStatus.CONFLICT).json(failResponse('Duplicate entry'));
        break;

      case 'ER_NO_REFERENCED_ROW':
      case 'ER_NO_REFERENCED_ROW_2':
        response.status(HttpStatus.CONFLICT).json(failResponse('Foreign key conflict'));
        break;

      default:
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json(failResponse('Internal server error'));
        break;
    }
  }
}
