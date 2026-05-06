import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IRequestUser } from '../auth/auth.interface';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request & { user?: IRequestUser }, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const timestamp = new Date().toISOString();
    const userId = req.user?.user_id ?? 'anonymous';

    Logger.log(`[${timestamp}] ${method} ${originalUrl} by user ${userId}`);

    res.on('finish', () => {
      const { statusCode } = res;
      Logger.log(
        `[${timestamp}] ${method} ${originalUrl} ${statusCode} by user ${userId}`,
      );
    });

    next();
  }
}
