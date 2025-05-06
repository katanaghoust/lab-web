import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class ETagMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;

    res.json = function (data) {
      // Генерируем ETag на основе данных
      const etag = createHash('md5').update(JSON.stringify(data)).digest('hex');
      const etagValue = `"${etag}"`;

      console.log(`Generated ETag: ${etagValue} for request ${req.url}`);

      // Устанавливаем ETag
      res.setHeader('ETag', etagValue);

      // Проверяем If-None-Match
      const ifNoneMatch = req.headers['if-none-match'];
      if (ifNoneMatch && ifNoneMatch === etagValue) {
        console.log(
          `ETag matched (${ifNoneMatch}), returning 304 Not Modified for ${req.url}`,
        );
        res.status(304).end();
        return res; // Завершаем ответ
      }

      console.log(
        `ETag ${etagValue} does not match If-None-Match ${ifNoneMatch}, sending data for ${req.url}`,
      );
      return originalJson.call(this, data);
    };

    next();
  }
}
