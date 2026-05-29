// D0150 — Estimated Annual Consumption / Meter Consumption Data

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0150_026 {
  mpan: string;
  msn: string;
  estimatedAnnualConsumption: string;
  eacReadDate: string;
  aahedc: string;
  siteVisitRequired: string;
}

export interface D0150Model {
  envelope: DFlowEnvelope;
  record026: D0150_026;
}

export function buildD0150(model: D0150Model): DFlowFile {
  const { envelope, record026: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '026', fields: [r.mpan, r.msn, r.estimatedAnnualConsumption, r.eacReadDate, r.aahedc, r.siteVisitRequired] },
    ],
  };
}
