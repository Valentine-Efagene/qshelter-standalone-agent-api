import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

export function SwaggerAuth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
  );
}
