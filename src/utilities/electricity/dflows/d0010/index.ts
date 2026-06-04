// D0010 — Provide Meter Readings
// File structure: ZHV → 026 → 028 → 030×N → ZPT
//
// Sample (single register):
//   ZHV|S090173959|D0010002|D|UDMS|X|GMTR|20260515152900||||OPER|
//   026|1100013222946|V|
//   028|E12Z070779|I|
//   030|S|20260518000000|256980.0|||T|N|
//   ZPT|S090173959|3||1|20260515153200|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0010Register {
  registerId: string;       // 030[0]
  readingDateTime: string;  // 030[1] — YYYYMMDDHHMMSS
  readingValue: string;     // 030[2] — NUM(9,1)
  meterReadingFlag: string; // 030[5] — T/F
  readingMethod: string;    // 030[6] — N/P
}

export interface D0010Model {
  envelope: DFlowEnvelope;
  mpan: string;                // 026[0]
  bscValidationStatus: string; // 026[1] — V/U/F
  msn: string;                 // 028[0]
  readingType: string;         // 028[1] — I/A/C/F etc.
  registers: D0010Register[];  // one 030 row per register
}

export function buildD0010(model: D0010Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '026', fields: [r.mpan, r.bscValidationStatus] },
      { recordType: '028', fields: [r.msn, r.readingType] },
      ...r.registers.map(reg => ({
        recordType: '030',
        fields: [reg.registerId, reg.readingDateTime, reg.readingValue, '', '', reg.meterReadingFlag, reg.readingMethod],
      })),
    ],
  };
}
