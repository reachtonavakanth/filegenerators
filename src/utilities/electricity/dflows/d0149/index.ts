// D0149 — NHH Meter Technical Details (Standing Data Notification)
// File structure: ZHV → 280 → 281 → 778 → 283 → 284 → ZPT
//
// Sample: ZHV|0000733557|D0149001|M|BMET|X|GMTR|20260515012400||||OPER|
//         280|1100013222946|20260518|
//         281|0393|20260518|
//         778|00001|
//         283|E12Z070779|
//         284|S|1|
//         ZPT|0000733557|5||1|20260515012600|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0149Model {
  envelope: DFlowEnvelope;
  mpan: string;                      // 280[1] / 281 shared key
  cosDate: string;                   // 280[2], 281[2] — YYYYMMDD
  ssc: string;                       // 281[1] — Standard Settlement Config
  timePatternRegiment: string;       // 778[1] — 5-digit TPR code
  msn: string;                       // 283[1] — Meter Serial Number
  registerId: string;                // 284[1] — 'S' or '01'
  registerMappingCoefficient: string;// 284[2] — e.g. '1'
}

export function buildD0149(model: D0149Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '280', fields: [r.mpan, r.cosDate] },
      { recordType: '281', fields: [r.ssc, r.cosDate] },
      { recordType: '778', fields: [r.timePatternRegiment] },
      { recordType: '283', fields: [r.msn] },
      { recordType: '284', fields: [r.registerId, r.registerMappingCoefficient] },
    ],
  };
}
