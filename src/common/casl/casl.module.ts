import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { AuthenticationGuard } from '../auth/auth.guard';

@Module({
    providers: [CaslAbilityFactory, AuthenticationGuard],
    exports: [CaslAbilityFactory, AuthenticationGuard],
})
export class CaslModule { }
