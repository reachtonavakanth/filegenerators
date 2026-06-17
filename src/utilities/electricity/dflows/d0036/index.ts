// D0036 — HH Consumption Data (DC → Supplier)
// File structure: ZHV → (101 → 102 → 103×48)×N → ZPT
//
// Sample (two MQIDs, single settlement date):
//   ZHV|0103175679|D0036001|C|SSIL|X|GMTR|20260617141613||||OPER|
//   101|1014572465589|AI|GMTR|
//   102|20260623|
//   103|A|9.8|
//   ... (48 × 103)
//   101|1014572465589|RI|GMTR|
//   102|20260623|
//   103|A|15.2|
//   ... (48 × 103)
//   ZPT|0103175679|100|100|2|20260617141614|
//
// Field mapping:
//   101[0] MPAN Core
//   101[1] Measurement Quantity ID (AI/AE/RI/RE/UN) — one 101 block per MQID
//   101[2] New Supplier Participant ID
//   102[0] Settlement Date (YYYYMMDD)
//   103[0] Actual/Estimated Indicator (A=Actual, C=Long Day/Short Day, E=Estimated)
//   103[1] Period Metered Consumption (±NUM(7,1)) — 48 records per settlement date
//   ZPT field[3] = total body line count (same as field[2])
//   ZPT field[4] = number of 101 blocks (batch count)

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope, DFlowRecord } from '../../../../shared/domain/types';

export interface D0036Period {
  indicator: string;   // A / C / E — per period
  consumption: string; // ±NUM(7,1)
}

export interface D0036SettlementDate {
  settlementDate: string; // 102[0] — YYYYMMDD
  periods: D0036Period[]; // 48 × 103
}

export interface D0036MQIDBlock {
  measurementQuantityId: string;    // 101[1]
  settlements: D0036SettlementDate[];
}

export interface D0036Model {
  envelope: DFlowEnvelope;
  mpan: string;                  // 101[0]
  supplierParticipantId: string; // 101[2]
  mqidBlocks: D0036MQIDBlock[];  // one 101 group per MQID
}

export function buildD0036(model: D0036Model): DFlowFile {
  const { envelope: env, mpan, supplierParticipantId, mqidBlocks } = model;
  const records: DFlowRecord[] = [];

  for (const block of mqidBlocks) {
    records.push({ recordType: '101', fields: [mpan, block.measurementQuantityId, supplierParticipantId] });
    for (const s of block.settlements) {
      records.push({ recordType: '102', fields: [s.settlementDate] });
      for (const p of s.periods) {
        if (!p.consumption.trim()) continue;
        records.push({ recordType: '103', fields: [p.indicator, p.consumption] });
      }
    }
  }

  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    batchCount: mqidBlocks.length,
    records,
  };
}
