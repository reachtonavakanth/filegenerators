// D0051 — Provide Meter Reading Routing Information (DC → Supplier)
// File structure: ZHV → 120 → ZPT
//
// Sample:
//   ZHV|B425358558|D0051001|C|SSIL|X|GMTR|20260206145800||||OPER|
//   120|1014568234275|M|20260604|20260604|
//   ZPT|B425358558|1||1|20260206145900|
//
// Field mapping:
//   120[1] MPAN Core
//   120[2] Retrieval Method (H/M/N/R/S/U — default M)
//   120[3] Retrieval Method Effective Date → COS Date
//   120[4] Effective from Settlement Date {REGI} → COS Date

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0051Model {
  envelope: DFlowEnvelope;
  mpan: string;                        // 120[1]
  retrievalMethod: string;             // 120[2] — default M
  retrievalMethodEffectiveDate: string;// 120[3] — COS Date
  effectiveFromSettlementDate: string; // 120[4] — COS Date
}

export function buildD0051(model: D0051Model): DFlowFile {
  return {
    envelope: model.envelope,
    fileName: `${model.envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      {
        recordType: '120',
        fields: [
          model.mpan,
          model.retrievalMethod,
          model.retrievalMethodEffectiveDate,
          model.effectiveFromSettlementDate,
        ],
      },
    ],
  };
}
