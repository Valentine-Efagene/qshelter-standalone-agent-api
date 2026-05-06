import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../user/user.enums';
import { UserService } from '../../user/user.service';
import { IRequestUser } from '../auth/auth.interface';

@Injectable()
export default class RoleCheckerMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) { }

  protected allowedRoles: UserRole[];

  async use(req: Request & { user?: IRequestUser }, res: Response, next: NextFunction) {
    const userId = req.user?.user_id;

    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }

    try {
      await this.userService.findOne(Number(userId));

      // if (!user.roles.some((value) => this.allowedRoles.includes(value))) {
      //   throw new UnauthorizedException();
      // }

      next();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
