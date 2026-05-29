// D0217 — Notification of Supplier Nomination
// Sent by CSS to MOB, DC, DA after registration accepted

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0217_026 {
  mpan: string;
  newSupplierId: string;
  registrationDate: string;
  oldSupplierId: string;
  cosDate: string;
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  distributorId: string;
}

export interface D0217Model {
  envelope: DFlowEnvelope;
  record026: D0217_026;
}

export function buildD0217(model: D0217Model): DFlowFile {
  const { envelope, record026: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      {
        recordType: '026',
        fields: [
          r.mpan,
          r.newSupplierId,
          r.registrationDate,
          r.oldSupplierId,
          r.cosDate,
          r.profileClass,
          r.measurementClass,
          r.gspGroupId,
          r.llfClass,
          r.ssc,
          r.distributorId,
        ],
      },
    ],
  };
}
