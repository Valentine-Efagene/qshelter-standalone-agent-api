import { applyDecorators, CanActivate, ExecutionContext, Injectable, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AuthHelper } from './auth.helper';
import { IAuthData, IRequestUser } from './auth.interface';
import { CaslAbilityFactory } from '../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY, PolicyHandler } from '../casl/policy.decorator';

@Injectable()
export class AuthenticationGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request & { user?: IRequestUser }>();
        const token = AuthHelper.getBearerToken(request);
        const jwtSecret = process.env.JWT_SECRET;

        if (!jwtSecret) {
            throw new UnauthorizedException('JWT secret is not configured');
        }

        let payload: IAuthData;

        try {
            const decoded = verify(token, jwtSecret) as unknown;
            payload = decoded as IAuthData;
        } catch {
            throw new UnauthorizedException('Invalid or expired token');
        }

        if (!payload?.user_id || !Array.isArray(payload.roles)) {
            throw new UnauthorizedException('Invalid token payload');
        }

        request.user = {
            ...payload,
            id: payload.user_id,
        };

        // Check policies if they exist
        const policyHandlers =
            this.reflector.get<PolicyHandler[]>(
                CHECK_POLICIES_KEY,
                context.getHandler(),
            ) ?? [];

        if (!policyHandlers.length) {
            return true;
        }

        const ability = this.caslAbilityFactory.createForUser(request.user);

        return policyHandlers.every((handler) =>
            typeof handler === 'function'
                ? handler(ability)
                : handler.handle(ability),
        );
    }
}

export function AuthGuard() {
    return applyDecorators(
        UseGuards(AuthenticationGuard),
        ApiBearerAuth(),
    );
}
