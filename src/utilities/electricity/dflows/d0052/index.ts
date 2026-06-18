// D0052 — Provide Standing Data (Profile Class, Measurement Class, SSC, GSP, TPR, EAC)
// File structure: ZHV → 121 → 122 → 124×N → ZPT
//
// Sample (two TPR groups, one register each):
//   ZHV|W000896813|D0052001|X|GMTR|M|DCOL|20260518120000||||OPER|
//   121|1100013222946|20260518|03|20260518|A|20260518|
//   122|0393|20260518|_A|20260518|
//   124|00001|3100.0|20260518|
//   124|00002|2500.0|20260518|
//   ZPT|W000896813|4||1|20260518120000|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0052Register {
  timePatternRegiment: string;        // 124[0]
  estimatedAnnualConsumption: string; // 124[1] — kWh
}

export interface D0052Model {
  envelope: DFlowEnvelope;
  mpan: string;              // 121[0]
  cosDate: string;           // 121[1], 121[3], 121[5], 122[1], 122[3], 124[2]
  profileClass: string;      // 121[2]
  measurementClass: string;  // 121[5]
  ssc: string;               // 122[0]
  gspGroupId: string;        // 122[2]
  registers: D0052Register[];
}

export function buildD0052(model: D0052Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '121', fields: [r.mpan, r.cosDate, r.profileClass, r.cosDate, r.measurementClass, r.cosDate] },
      { recordType: '122', fields: [r.ssc, r.cosDate, r.gspGroupId, r.cosDate] },
      ...r.registers.map(reg => ({
        recordType: '124',
        fields: [reg.timePatternRegiment, reg.estimatedAnnualConsumption, r.cosDate],
      })),
    ],
  };
}
