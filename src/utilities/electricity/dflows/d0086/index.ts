// D0086 — Profile Class and Measurement Class Amendment

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0086_026 {
  mpan: string;
  newProfileClass: string;
  newMeasurementClass: string;
  effectiveFromDate: string;
  reasonCode: string;
  ssc: string;
}

export interface D0086Model {
  envelope: DFlowEnvelope;
  record026: D0086_026;
}

export function buildD0086(model: D0086Model): DFlowFile {
  const { envelope, record026: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '026', fields: [r.mpan, r.newProfileClass, r.newMeasurementClass, r.effectiveFromDate, r.reasonCode, r.ssc] },
    ],
  };
}
