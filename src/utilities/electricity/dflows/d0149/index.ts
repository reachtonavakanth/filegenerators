// D0149 — NHH Meter Technical Details (Standing Data Notification)
// File structure: ZHV → 280 → 281 → [778 → 283 → 284×N]×M → ZPT
//
// Sample (two TPR groups, one register each):
//   ZHV|0000733557|D0149001|M|BMET|X|GMTR|20260515012400||||OPER|
//   280|1100013222946|20260518|
//   281|0393|20260518|
//   778|00001|
//   283|E12Z070779|
//   284|S|1|
//   778|00002|
//   283|E12Z070779|
//   284|01|-1|
//   ZPT|0000733557|7||1|20260515012600|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0149Register {
  registerId: string;          // 284[0] — 'S' or '01'
  registerCoefficient: string; // 284[1] — '1' or '-1'
}

export interface D0149TprGroup {
  timePatternRegiment: string; // 778[0]
  msn: string;                 // 283[0]
  registers: D0149Register[];  // one 284 row per register
}

export interface D0149Model {
  envelope: DFlowEnvelope;
  mpan: string;       // 280[0]
  cosDate: string;    // 280[1] — YYYYMMDD
  ssc: string;        // 281[0]
  sconDate: string;   // 281[1] — YYYYMMDD
  tprGroups: D0149TprGroup[];
}

export function buildD0149(model: D0149Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '280', fields: [r.mpan, r.cosDate] },
      { recordType: '281', fields: [r.ssc, r.sconDate] },
      ...r.tprGroups.flatMap(group => [
        { recordType: '778', fields: [group.timePatternRegiment] },
        { recordType: '283', fields: [group.msn] },
        ...group.registers.map(reg => ({
          recordType: '284',
          fields: [reg.registerId, reg.registerCoefficient],
        })),
      ]),
    ],
  };
}
