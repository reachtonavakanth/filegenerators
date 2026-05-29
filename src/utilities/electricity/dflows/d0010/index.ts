// D0010 — Market Domain Data
// File structure: ZHV → [026|028|030]+ → ZTT  (one 026/028/030 group per meter point)
//
// Sample: ZHV|0000003421|D0010001|D|V002|DCOL|SUPP|20260519213012||||OPER|
//         026|1100012345678|
//         028|S123456|E|
//         030|01|20260519|054321|N||
//         ZTT|0000003421|00000008|20260519213500

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope, DFlowRecord } from '../../../../shared/domain/types';

export interface D0010_MeterPoint {
  mpan: string;             // 026 — 13-digit MPAN
  msn: string;              // 028[1] — Meter Serial Number
  energisationStatus: string; // 028[2] — 'E' | 'D'
  registerId: string;       // 030[1] — register ID e.g. '01'
  readDate: string;         // 030[2] — YYYYMMDD
  readValue: string;        // 030[3] — meter reading
  readFlag: string;         // 030[4] — e.g. 'N'
}

export interface D0010Model {
  envelope: DFlowEnvelope;
  meterPoints: D0010_MeterPoint[];
}

export function buildD0010(model: D0010Model): DFlowFile {
  const { envelope, meterPoints } = model;
  const records: DFlowRecord[] = [];

  for (const mp of meterPoints) {
    records.push({ recordType: '026', fields: [mp.mpan] });
    records.push({ recordType: '028', fields: [mp.msn, mp.energisationStatus] });
    records.push({ recordType: '030', fields: [mp.registerId, mp.readDate, mp.readValue, mp.readFlag, ''] });
  }

  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records,
  };
}
