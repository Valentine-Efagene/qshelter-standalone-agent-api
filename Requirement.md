Here’s a clean **copyable Markdown specification** of your unified requirements.

---

# QShelter Agent Dashboard Specification

## Domain

- Agent dashboard domain: **agent.qshelter.ng**

---

# 1. Agent Types

## 1.1 Elite Partner Agent

Has extended licensing + documentation requirements.

## 1.2 QShelter Licensed Agent

Simplified onboarding with internal certification path.

---

# 2. Onboarding Flow

## 2.1 Sign Up

User selects:

- Elite Partner Agent
- QShelter Licensed Agent

System dynamically displays requirements based on selection.

---

## 2.2 Basic Information

- First Name
- Last Name
- Email Address
- Phone Number
- Country of Residence
- State of Residence
- Password

---

## 2.3 Email Verification

- OTP verification sent to email

---

# 3. Profile Setup

## 3.1 Elite Partner Agent Requirements

### Identity Verification

- Government-issued ID:

  - International Passport
  - Driver’s License
  - NIN

### Bank Details

- Select Bank
- Account Number (validated)

### Licensing Requirements

- CAC Certificate (required)
- Agent License (optional):

  - ESVARBON
  - LASRERA
  - NIESV

### Final Step

- Accept Terms & Conditions
- Submit for approval

---

## 3.2 QShelter Licensed Agent Requirements

### Identity Verification

- Government-issued ID:

  - International Passport
  - Driver’s License
  - NIN

### Bank Details

- Select Bank
- Account Number (validated)

### Licensing Requirements

- QShelter Training Certificate (optional)

### Final Step

- Accept Terms & Conditions
- Submit for approval

---

# 4. Agent Approval Lifecycle

Agent onboarding stages:

- Basic Info
- Email Verified
- Profile Setup
- Documents Uploaded
- Submitted
- Approved
- Rejected

---

# 5. Dashboard Overview

## 5.1 Key Actions

- Invite Customers (generate invite link)

---

## 5.2 Metrics

- Total Customers
- Total Sales Count
- Total Sales Amount
- Total Asset Value

---

# 6. Navigation Modules

- Dashboard / Overview
- Customers
- Payments
- Requests
- Settings

---

# 7. Customers Module

## 7.1 Customer List Table

Fields:

- Name
- Email
- Phone
- Application Status:

  - Not Started
  - Started

- Action: View More

---

## 7.2 Customer Detail View

### Basic Info

- Name
- Email
- Phone

### Application Details

- Date Started
- Expected Completion Date
- Property Type
- Property Price
- Payment Option:

  - Mortgage
  - Installment
  - Outright

- Expected Equity Amount

---

# 8. Payments Module

## 8.1 Agent Wallet Profile

- Account Balance
- Account Name
- Account Number
- Bank

---

## 8.2 Earnings Summary

- Total Commissions (to date)
- Total Bonuses (to date)

---

## 8.3 Sales Commission Tab

- List customers actively paying
- Progress bar:

  - Current Commission vs Expected Commission

Commission Rule:

- Agent commission rate is configurable per agent type (stored in `agent_configurations` table)
- Default fallback: **5% of payment value**

---

## 8.4 Sales Bonus Tab

- Bonus is based on **total property value sold** (not cash received)
- Two tiers per agent type, all thresholds and rates are configurable in `agent_configurations`

### Elite Partner Agent Bonus Tiers

| Tier   | Minimum Total Property Value Sold           | Bonus Rate                   |
| ------ | ------------------------------------------- | ---------------------------- |
| Tier 1 | `bonus_tier1_threshold` (e.g. ₦50,000,000)  | `bonus_tier1_rate` (e.g. 2%) |
| Tier 2 | `bonus_tier2_threshold` (e.g. ₦100,000,000) | `bonus_tier2_rate` (e.g. 5%) |

### QShelter Licensed Agent Bonus Tiers

| Tier   | Minimum Total Property Value Sold          | Bonus Rate                     |
| ------ | ------------------------------------------ | ------------------------------ |
| Tier 1 | `bonus_tier1_threshold` (e.g. ₦30,000,000) | `bonus_tier1_rate` (e.g. 1.5%) |
| Tier 2 | `bonus_tier2_threshold` (e.g. ₦70,000,000) | `bonus_tier2_rate` (e.g. 3%)   |

- Tier 2 always supersedes Tier 1 when the higher threshold is met
- Progress bar visualises current property value sold vs next tier threshold

---

## 8.5 Payment History

- All payments made into agent account

---

# 9. Requests Module

## 9.1 Documentation Requests

- Handle document submission requests

## 9.2 Mortgage Requests

- Maintain existing mortgage workflow

---

# 10. Invite System

- Generate unique invite link per agent
- Track usage count
- Link customers to referring agent

---

# 11. Business Rules

## Agent Configuration (`agent_configurations` table)

One row per agent type. Managed by ADMIN only. All financial rates and bonus thresholds live here.

| Field                   | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `agent_type`            | `ELITE_PARTNER` or `QSHELTER_LICENSED`                    |
| `commission_rate`       | Decimal rate applied to payment amount (e.g. `0.05` = 5%) |
| `bonus_tier1_threshold` | Min total property value sold to qualify for Tier 1 bonus |
| `bonus_tier1_rate`      | Bonus percentage at Tier 1                                |
| `bonus_tier2_threshold` | Min total property value sold to qualify for Tier 2 bonus |
| `bonus_tier2_rate`      | Bonus percentage at Tier 2                                |

## Commission Calculation

- `commission = payment_amount × commission_rate` (from `agent_configurations` for the agent's type)
- Falls back to `COMMISSION_RATE` env var if no DB config row exists

## Bonus Calculation

- Bonuses are computed from **total property value sold**, not cash received
- If `total_sold >= bonus_tier2_threshold` → apply `bonus_tier2_rate`
- Else if `total_sold >= bonus_tier1_threshold` → apply `bonus_tier1_rate`
- Else → no bonus
- Thresholds and rates differ per agent type

## Dashboard Metrics

All dashboard metrics are computed from:

- Customers
- Applications
- Payments
- Commissions

(No duplicate storage of aggregates)

---

# 12. System Principles

- Single Agent entity governs entire lifecycle
- Documents are polymorphic by type
- Metrics are computed, not stored
- Onboarding state drives access control
- Wallet separated from payments
- Invite system links agents to customers

---
