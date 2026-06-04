// D0086 — Provide Meter Readings (DC to Supplier)
// File structure: ZHV → 196 → 197 → 198×N → ZPT
// Mirrors D0010 structure; record numbers 196/197/198 instead of 026/028/030
//
// Sample (single register):
//   ZHV|0006597907|D0086002|D|UDMS|X|GMTR|20260515153500||||OPER|
//   196|1100013222946|V|
//   197|E12Z070779|A|
//   198|S|20260518000000|256980.0|||T|N|
//   ZPT|0006597907|3||1|20260515154000|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0086Register {
  registerId: string;       // 198[0]
  readingDateTime: string;  // 198[1] — YYYYMMDDHHMMSS
  readingValue: string;     // 198[2] — NUM(9,1)
  meterReadingFlag: string; // 198[5] — T/F
  readingMethod: string;    // 198[6] — N/P
}

export interface D0086Model {
  envelope: DFlowEnvelope;
  mpan: string;                // 196[0]
  bscValidationStatus: string; // 196[1] — V/U/F
  msn: string;                 // 197[0]
  readingType: string;         // 197[1]
  registers: D0086Register[];  // one 198 row per register
}

export function buildD0086(model: D0086Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '196', fields: [r.mpan, r.bscValidationStatus] },
      { recordType: '197', fields: [r.msn, r.readingType] },
      ...r.registers.map(reg => ({
        recordType: '198',
        fields: [reg.registerId, reg.readingDateTime, reg.readingValue, '', '', reg.meterReadingFlag, reg.readingMethod],
      })),
    ],
  };
}
