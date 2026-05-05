# QShelter Agent API — Copilot Instructions

## Project Overview

NestJS 10 REST API for the QShelter Agent Dashboard (`agent.qshelter.ng`).

**This API owns two domains only:**

1. **Onboarding** — agent registration, document submission, licensing, and approval lifecycle
2. **Analytics** — computed dashboard metrics (customers, commissions, sales totals)

Payment processing, wallet management, and transaction ledgers are owned by an external financial service. Customer data is owned by the external mofi platform. This API reads from those systems but **never writes to their tables**. Modules that map to external tables are clearly marked read-only.

## Stack

- **Framework**: NestJS 10 with TypeScript
- **ORM**: TypeORM 0.3 with MySQL
- **Auth**: JWT + Refresh tokens; authorization via `@casl/ability` (custom NestJS integration at `src/common/casl/`)
- **Validation**: `class-validator` + `class-transformer` on all DTOs
- **Pagination**: `nestjs-paginate`
- **File uploads**: AWS S3 via `@aws-sdk/client-s3`
- **API docs**: `@nestjs/swagger`
- **No GraphQL** — all resolvers have been removed; use REST controllers only

## Architecture

Each domain lives in its own module folder (`src/<domain>/`) containing:

```
<domain>.module.ts
<domain>.controller.ts
<domain>.service.ts
<domain>.repository.ts
<domain>.entity.ts
<domain>.dto.ts
<domain>.enums.ts
<domain>.type.ts
```

Shared abstractions live in `src/common/`:

- `common.pure.entity.ts` — `AbstractBaseEntity` (id, createdAt, updatedAt, deletedAt)
- `common.entity.ts` — `AbstractBaseReviewableEntity`, `AbstractBaseDocumentEntity`
- `common/casl/` — `CaslAbilityFactory`, `PoliciesGuard`, `@CheckPolicies()` decorator, `CaslModule`

## Modules

### Owned (read + write)

| Module        | Path                  | Notes                                                                                                        |
| ------------- | --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Agent         | `src/agent/`          | Agent onboarding lifecycle; two types: Elite Partner, QShelter Licensed                                      |
| AgentDocument | `src/agent-document/` | Polymorphic documents; table: `agent_documents`                                                              |
| LicensingInfo | `src/licensing-info/` | Linked to `AgentDocument` via `OneToMany`                                                                    |
| Referral      | `src/referral/`       | Invite links; agents linked to customers                                                                     |
| Commission    | `src/commission/`     | 5% commission rule; computed from external payment data                                                      |
| Notification  | `src/notification/`   | Email/push notifications                                                                                     |
| AgentPoc      | `src/agent-poc/`      | Proof-of-concept agent flow                                                                                  |
| CASL          | `src/common/casl/`    | Authorization — SUPER_ADMIN/ADMIN manage all; FINANCE_ADMIN/SALES_ADMIN read all; AGENT/USER read+update own |

### External (read-only)

These modules map to tables owned by external services. **Never add create/update/delete operations to these services.** Controllers expose GET endpoints only.

| Module      | Path               | External Source   | Table          |
| ----------- | ------------------ | ----------------- | -------------- |
| User        | `src/user/`        | mofi platform     | `users`        |
| Wallet      | `src/wallet/`      | financial service | `wallets`      |
| Payment     | `src/payment/`     | financial service | `payments`     |
| Transaction | `src/transaction/` | financial service | `transactions` |

## Conventions

- **Entity table names**: always explicit `@Entity({ name: 'snake_case_plural' })`
- **DTOs**: extend `PickType`/`PartialType` from `@nestjs/swagger`, not `@nestjs/graphql`
- **Repository pattern**: extend `Repository<Entity>` and inject with `@InjectRepository`
- **No resolvers**: do not create `*.resolver.ts` files
- **No GraphQL imports**: do not import from `@nestjs/graphql`, `@nestjs/apollo`, or `graphql`
- **Migrations**: `npm run migration:generate` / `npm run migration:run`

## Build & Run

```bash
npm run start:dev       # development with watch
npm run build           # production build
npm run migration:run   # run TypeORM migrations
npm run test            # unit tests
npm run test:e2e        # e2e tests
```

## Business Rules

- Agent commission rate is set by `COMMISSION_RATE` env var (decimal, e.g. `0.05` = 5%); defaults to `0.05`
- Commission is computed as `payment_amount × COMMISSION_RATE` inside `CommissionService.postCommissionWithCode`
- Dashboard metrics (totals, counts) are **computed**, not stored as aggregates
- Onboarding state drives access control
- Wallet is separate from payment history
- Each agent has a unique invite link tracked by usage count

## Permission Boundaries (CASL)

Defined in `src/common/casl/casl-ability.factory.ts`. Subjects: `User`, `Agent`, `Commission`, `Referral`, `LicensingInfo`, `AgentDocument`.

| Role                           | Permissions                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `SUPER_ADMIN`, `ADMIN`         | `manage all` — full CRUD on everything                                                                                          |
| `FINANCE_ADMIN`, `SALES_ADMIN` | `read all` — read-only across all resources                                                                                     |
| `AGENT`                        | Read/update own `User` and `Agent` profile; create/read own `LicensingInfo`, `AgentDocument`, `Referral`; read own `Commission` |
| `USER`                         | Read/update own `User` profile only                                                                                             |
