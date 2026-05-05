/**
 * All document types an agent can submit.
 * Optional types are listed in OPTIONAL_DOCUMENT_TYPES below.
 */
export enum DocumentType {
  // Identity — required for both agent types
  INTERNATIONAL_PASSPORT = 'INTERNATIONAL_PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  NIN = 'NIN',

  // Elite Partner — required
  CAC_CERTIFICATE = 'CAC_CERTIFICATE',

  // Elite Partner — optional (agent license from any regulatory body)
  ESVARBON_LICENSE = 'ESVARBON_LICENSE',
  LASRERA_LICENSE = 'LASRERA_LICENSE',
  NIESV_LICENSE = 'NIESV_LICENSE',

  // QShelter Licensed — optional
  QSHELTER_TRAINING_CERTIFICATE = 'QSHELTER_TRAINING_CERTIFICATE',
}

/**
 * Document types that are NOT required during onboarding.
 * Derived from Requirement.md sections 3.1 and 3.2.
 */
export const OPTIONAL_DOCUMENT_TYPES: Set<DocumentType> = new Set([
  DocumentType.ESVARBON_LICENSE,
  DocumentType.LASRERA_LICENSE,
  DocumentType.NIESV_LICENSE,
  DocumentType.QSHELTER_TRAINING_CERTIFICATE,
]);
