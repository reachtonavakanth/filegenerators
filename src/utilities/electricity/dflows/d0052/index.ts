// D0052 — Provide Standing Data (Profile Class, Measurement Class, SSC, GSP, TPR, EAC)
// File structure: ZHV → 121 → 122 → 124 → ZPT
//
// Sample: ZHV|W000896813|D0052001|X|GMTR|M|DCOL|20260518120000||||OPER|
//         121|1100013222946|20260518|03||20260518|A||20260518|
//         122|0393|20260518|_A|20260518|
//         124|00001|3100|20260518|
//         ZPT|W000896813|3||1|20260518120000|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0052Model {
  envelope: DFlowEnvelope;
  mpan: string;              // 121[0]
  cosDate: string;           // 121[1], 121[4], 121[7], 122[1], 122[3], 124[2] — YYYYMMDD
  profileClass: string;      // 121[2]
  measurementClass: string;  // 121[5]
  ssc: string;               // 122[0]
  gspGroupId: string;        // 122[2]
  timePatternRegiment: string;          // 124[0]
  estimatedAnnualConsumption: string;   // 124[1]
}

export function buildD0052(model: D0052Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      // 121: MPAN | COS Date | Profile Class | | COS Date | Measurement Class | | COS Date
      { recordType: '121', fields: [r.mpan, r.cosDate, r.profileClass, '', r.cosDate, r.measurementClass, '', r.cosDate] },
      // 122: SSC | COS Date | GSP Group ID | COS Date
      { recordType: '122', fields: [r.ssc, r.cosDate, r.gspGroupId, r.cosDate] },
      // 124: Time Pattern Regime | EAC (kWh) | COS Date
      { recordType: '124', fields: [r.timePatternRegiment, r.estimatedAnnualConsumption, r.cosDate] },
    ],
  };
}
