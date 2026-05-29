// D0012 — Meter Reading Instruction

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0012_026 {
  mpan: string;
  msn: string;
  requestedReadDate: string;
  reasonCode: string;
  originalScheduledReadDate: string;
  registerId: string;
}

export interface D0012Model {
  envelope: DFlowEnvelope;
  record026: D0012_026;
}

export function buildD0012(model: D0012Model): DFlowFile {
  const { envelope, record026: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '026', fields: [r.mpan, r.msn, r.requestedReadDate, r.reasonCode, r.originalScheduledReadDate, r.registerId] },
    ],
  };
}
