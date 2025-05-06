import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = Date.now() - start;
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse<Response>();

        if (request && response && !response.headersSent) {
          console.log(`Request to ${request.url} took ${elapsedTime}ms`);

          if (request.res && request.res.locals && !response.headersSent) {
            request.res.locals.elapsedTime = elapsedTime;
            console.log(`Set elapsedTime in res.locals: ${elapsedTime}ms`);
          } else if (!response.headersSent) {
            response.header('X-Elapsed-Time', elapsedTime.toString());
          }
        } else {
          console.log(`GraphQL request took ${elapsedTime}ms`);
        }
      }),
    );
  }
}
