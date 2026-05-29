// D0019 — Validated Meter Reading

import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0019_026 {
  mpan: string;
  msn: string;
  registerId: string;
  readDate: string;
  validatedReading: string;
  readingType: string;
  validationMethod: string;
  measurementQuantityId: string;
}

export interface D0019Model {
  envelope: DFlowEnvelope;
  records026: D0019_026[];
}

export function buildD0019(model: D0019Model): DFlowFile {
  return {
    envelope: model.envelope,
    fileName: `${model.envelope.xRef}.usr`,
    trailerType: 'ZTT',
    records: model.records026.map((r) => ({
      recordType: '026',
      fields: [r.mpan, r.msn, r.registerId, r.readDate, r.validatedReading, r.readingType, r.validationMethod, r.measurementQuantityId],
    })),
  };
}
