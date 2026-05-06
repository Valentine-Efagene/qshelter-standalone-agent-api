import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export class AuthHelper {
    static getAuthorizationHeader(request: Request): string {
        const authHeader = request.headers.authorization;
        if (!authHeader || Array.isArray(authHeader)) {
            throw new UnauthorizedException('Authorization header is missing');
        }

        return authHeader;
    }

    static getBearerToken(request: Request): string {
        const authHeader = this.getAuthorizationHeader(request);
        const [scheme, token] = authHeader.split(' ');

        if (!scheme || !token || scheme.toLowerCase() !== 'bearer') {
            throw new UnauthorizedException('Invalid authorization format');
        }

        return token;
    }
}
