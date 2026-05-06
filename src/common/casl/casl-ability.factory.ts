import { Injectable } from '@nestjs/common';
import {
    AbilityBuilder,
    createMongoAbility,
    MongoAbility,
    InferSubjects,
    ExtractSubjectType,
} from '@casl/ability';
import { User } from '../../user/user.entity';
import { Agent } from '../../agent/agent.entity';
import { Commission } from '../../commission/commission.entity';
import { Referral } from '../../referral/referral.entity';
import { LicensingInfo } from '../../licensing-info/licensing-info.entity';
import { AgentDocument } from '../../agent-document/agent-document.entity';
import { UserRole } from '../../user/user.enums';
import { IRequestUser } from '../auth/auth.interface';

export enum Action {
    Manage = 'manage',
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
}

type Subjects = InferSubjects<
    | typeof User
    | typeof Agent
    | typeof Commission
    | typeof Referral
    | typeof LicensingInfo
    | typeof AgentDocument
> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
    createForUser(user: User | IRequestUser): AppAbility {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );

        const roles = user.roles ?? [];
        // Extract user ID: IRequestUser has 'id', User also has 'id'
        const userId = (user as any).id ?? (user as any).user_id ?? 0;

        if (roles.includes(UserRole.SUPER_ADMIN) || roles.includes(UserRole.ADMIN)) {
            can(Action.Manage, 'all');
            return build({ detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects> });
        }

        if (roles.includes(UserRole.FINANCE_ADMIN) || roles.includes(UserRole.SALES_ADMIN)) {
            can(Action.Read, 'all');
        }

        if (roles.includes(UserRole.AGENT)) {
            // Agents read/update their own User and Agent profile
            can(Action.Read, User, { id: userId });
            can(Action.Update, User, { id: userId });
            can(Action.Read, Agent, { userId });
            can(Action.Update, Agent, { userId });
            // Agents manage their own licensing info and documents
            can(Action.Read, LicensingInfo, { agentId: userId });
            can(Action.Create, LicensingInfo, { agentId: userId });
            can(Action.Read, AgentDocument);
            can(Action.Create, AgentDocument);
            // Agents read their own referrals and commissions
            can(Action.Read, Referral, { referrerId: userId });
            can(Action.Create, Referral, { referrerId: userId });
            can(Action.Read, Commission);
        }

        if (roles.includes(UserRole.USER)) {
            can(Action.Read, User, { id: userId });
            can(Action.Update, User, { id: userId });
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
