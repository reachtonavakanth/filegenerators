// D0012 — Meter Reading Instruction (DC → Supplier)
// File structure: ZHV → 039 → ZPT
//
// Sample: ZHV|0214090855|D0012001|D|UDMS|X|GMTR|20260520144400||||OPER|
//         039|1100013222946|20260518|D||
//         ZPT|0214090855|1||1|20260520144500|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0012Model {
  envelope: DFlowEnvelope;
  mpan: string;                // 039[0] — MPAN Core
  cosDate: string;             // 039[1] — Change of Supplier Date YYYYMMDD
  regularReadingCycle: string; // 039[2] — A/B/D/E/H/M/N/O/Q/S/T/W/Z
}

export function buildD0012(model: D0012Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '039', fields: [r.mpan, r.cosDate, r.regularReadingCycle, ''] },
    ],
  };
}
