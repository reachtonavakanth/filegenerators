// D0036 — Completed MIAD / Meter Installation Activity Details
// TODO: full spec not yet provided — stub builder

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0036Model {
  envelope: DFlowEnvelope;
  mpan: string;
  cosDate: string;
}

export function buildD0036(model: D0036Model): DFlowFile {
  return {
    envelope: model.envelope,
    fileName: `${model.envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '026', fields: [model.mpan, model.cosDate] },
    ],
  };
}
