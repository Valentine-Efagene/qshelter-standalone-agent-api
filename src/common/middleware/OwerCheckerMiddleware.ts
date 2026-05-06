import { UserRole } from '../../user/user.enums';
import {
  BadRequestException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';
import { NextFunction, Request, Response } from 'express';
import { IRequestUser } from '../auth/auth.interface';

export default class OwerCheckerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) { }

  protected allowedRoles: UserRole[];

  async use(req: Request & { user?: IRequestUser }, res: Response, next: NextFunction) {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.userService.findOne(Number(userId));

    if (user.id !== userId) {
      throw new UnauthorizedException();
    }

    next();
  }
}
