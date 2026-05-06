export enum PreferredContactMethod {
  PHONE_NUMBER = 'PHONE_NUMBER',
  EMAIL = 'EMAIL',
}

export enum AgentType {
  QSHELTER_LICENSED = 'QSHELTER_LICENSED',
  ELITE_PARTNER = 'ELITE_PARTNER',
}

/**
 * Onboarding lifecycle stages, in progression order.
 * - BASIC_INFO: Agent record created with basic profile data
 * - EMAIL_VERIFIED: Email confirmed by auth service (external)
 * - PROFILE_SETUP: Bank details and identity documents submitted
 * - DOCUMENTS_UPLOADED: All required licensing documents uploaded
 * - SUBMITTED: Agent has accepted T&C and submitted for review
 * - APPROVED: Admin has approved the application
 * - REJECTED: Admin has rejected the application (comment required)
 */
export enum AgentStatus {
  BASIC_INFO = 'BASIC_INFO',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PROFILE_SETUP = 'PROFILE_SETUP',
  DOCUMENTS_UPLOADED = 'DOCUMENTS_UPLOADED',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Stages that can only be set by an admin reviewer (not self-progressed).
 */
export const ADMIN_ONLY_STATUSES = new Set([AgentStatus.APPROVED, AgentStatus.REJECTED]);

/**
 * Terminal stages — no further progression allowed.
 */
export const TERMINAL_STATUSES = new Set([AgentStatus.APPROVED]);

