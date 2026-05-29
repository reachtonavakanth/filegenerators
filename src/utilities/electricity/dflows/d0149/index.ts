// D0149 — Provide Meter Readings

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0149_026 {
  mpan: string;
  msn: string;
  registerId: string;
  readDate: string;
  readingType: string;
  readValue: string;
  measurementQuantityId: string;
}

export interface D0149Model {
  envelope: DFlowEnvelope;
  records026: D0149_026[];
}

export function buildD0149(model: D0149Model): DFlowFile {
  return {
    envelope: model.envelope,
    fileName: `${model.envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: model.records026.map((r) => ({
      recordType: '026',
      fields: [r.mpan, r.msn, r.registerId, r.readDate, r.readingType, r.readValue, r.measurementQuantityId],
    })),
  };
}
