import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    if (typeof message === 'object' && message !== null) {
      // Преобразуем сообщение в читаемый формат
      const { message: errorMessages } = message as {
        message: string | string[];
      };

      if (Array.isArray(errorMessages)) {
        response.status(status).json({
          statusCode: status,
          message: errorMessages.join(', '),
        });
      } else {
        response.status(status).json({
          statusCode: status,
          message: errorMessages,
        });
      }
    } else {
      response.status(status).json({
        statusCode: status,
        message,
      });
    }
  }
}
