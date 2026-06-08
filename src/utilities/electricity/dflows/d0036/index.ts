// D0036 — HH Consumption Data (DC → Supplier)
// File structure: ZHV → 101 → (102 → 103×48)×N → ZPT
//
// Sample (single settlement date):
//   ZHV|UC05176778|D0036001|C|SSIL|X|GMTR|20260605161900||||OPER|
//   101|1014568234275|AI|GMTR|
//   102|20260604|
//   103|A|9.8|
//   ... (48 × 103 records)
//   ZPT|UC05176778|50||1|20260605162000|
//
// Field mapping:
//   101[0] MPAN Core
//   101[1] Measurement Quantity ID (AI/AE/RI/RE/UN)
//   101[2] New Supplier Participant ID
//   102[0] Settlement Date (YYYYMMDD) — one per settlement date block
//   103[0] Actual/Estimated Indicator (A=Actual, C=Long Day/Short Day, E=Estimated) — per period
//   103[1] Period Metered Consumption (±NUM(7,1)) — 48 records per settlement date

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

export interface D0036Model {
  envelope: DFlowEnvelope;
  mpan: string;                  // 101[0]
  measurementQuantityId: string; // 101[1]
  supplierParticipantId: string; // 101[2]
  settlements: D0036SettlementDate[]; // one or more settlement date blocks
}

export function buildD0036(model: D0036Model): DFlowFile {
  const { envelope: env, mpan, measurementQuantityId, supplierParticipantId, settlements } = model;
  const records: DFlowRecord[] = [
    { recordType: '101', fields: [mpan, measurementQuantityId, supplierParticipantId] },
  ];
  for (const s of settlements) {
    records.push({ recordType: '102', fields: [s.settlementDate] });
    for (const p of s.periods) {
      if (!p.consumption.trim()) continue; // omit 103 row for missing periods
      records.push({ recordType: '103', fields: [p.indicator, p.consumption] });
    }
  }
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records,
  };
}
