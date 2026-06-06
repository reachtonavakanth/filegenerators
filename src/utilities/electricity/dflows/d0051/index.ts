// D0051 — Provide Meter Reading Routing Information
// TODO: full spec not yet provided — stub builder

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0051Model {
  envelope: DFlowEnvelope;
  mpan: string;
  cosDate: string;
}

export function buildD0051(model: D0051Model): DFlowFile {
  return {
    envelope: model.envelope,
    fileName: `${model.envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '026', fields: [model.mpan, model.cosDate] },
    ],
  };
}
