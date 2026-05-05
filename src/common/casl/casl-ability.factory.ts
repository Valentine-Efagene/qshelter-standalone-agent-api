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
    createForUser(user: User): AppAbility {
        const { can, build } = new AbilityBuilder<AppAbility>(
            createMongoAbility,
        );

        const roles = user.roles ?? [];

        if (roles.includes(UserRole.SUPER_ADMIN) || roles.includes(UserRole.ADMIN)) {
            can(Action.Manage, 'all');
            return build({ detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects> });
        }

        if (roles.includes(UserRole.FINANCE_ADMIN) || roles.includes(UserRole.SALES_ADMIN)) {
            can(Action.Read, 'all');
        }

        if (roles.includes(UserRole.AGENT)) {
            // Agents read/update their own User and Agent profile
            can(Action.Read, User, { id: user.id });
            can(Action.Update, User, { id: user.id });
            can(Action.Read, Agent, { userId: user.id });
            can(Action.Update, Agent, { userId: user.id });
            // Agents manage their own licensing info and documents
            can(Action.Read, LicensingInfo, { agentId: user.id });
            can(Action.Create, LicensingInfo, { agentId: user.id });
            can(Action.Read, AgentDocument);
            can(Action.Create, AgentDocument);
            // Agents read their own referrals and commissions
            can(Action.Read, Referral, { referrerId: user.id });
            can(Action.Create, Referral, { referrerId: user.id });
            can(Action.Read, Commission);
        }

        if (roles.includes(UserRole.USER)) {
            can(Action.Read, User, { id: user.id });
            can(Action.Update, User, { id: user.id });
        }

        return build({
            detectSubjectType: (item) =>
                item.constructor as ExtractSubjectType<Subjects>,
        });
    }
}
