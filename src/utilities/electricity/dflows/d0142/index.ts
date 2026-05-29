// D0142 — Request for Energisation / De-energisation

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export type EnergisationAction = 'E' | 'D';

export interface D0142_026 {
  mpan: string;
  msn: string;
  requestedDate: string;
  actionRequired: EnergisationAction;
  reasonCode: string;
  accessDetails: string;
  contactName: string;
  contactNumber: string;
}

export interface D0142Model {
  envelope: DFlowEnvelope;
  record026: D0142_026;
}

export function buildD0142(model: D0142Model): DFlowFile {
  const { envelope, record026: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '026', fields: [r.mpan, r.msn, r.requestedDate, r.actionRequired, r.reasonCode, r.accessDetails, r.contactName, r.contactNumber] },
    ],
  };
}
