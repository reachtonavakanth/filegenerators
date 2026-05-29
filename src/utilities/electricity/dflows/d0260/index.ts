// D0260 — Market Domain Data (Meter Point Details)
// File structure: ZHV → 757 (batch header) → 758 (meter point record) → ZPT
//
// Sample: ZHV|8970|D0260002|P|EMEB|SUPP|Supp|20260515110800||||OPER|
//         757|8970|
//         758|17658|SP43|1100013222946|20260518|NATP|E|A|801|03||UDMS|N|UDMS|N|EELC|N||||||N|
//         ZPT|8970|2||1|20260515111500|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0260_758 {
  mddReference: string;          // field[2]  — MDD internal reference e.g. '17658'
  supplierId: string;            // field[3]  — current supplier e.g. 'SP43'
  mpan: string;                  // field[4]  — 13-digit MPAN
  effectiveDate: string;         // field[5]  — YYYYMMDD
  customerClassification: string;// field[6]  — e.g. 'NATP'
  energisationStatus: string;    // field[7]  — 'E' | 'D'
  measurementClass: string;      // field[8]  — 'A'–'I'
  llfClass: string;              // field[9]  — Line Loss Factor Class
  profileClass: string;          // field[10] — '01'–'08'
  ssc: string;                   // field[11] — Standard Settlement Config (blank for HH)
  mobId: string;                 // field[12] — Meter Operator party ID
  mobStatus: string;             // field[13] — 'N' active
  dcId: string;                  // field[14] — Data Collector party ID
  dcStatus: string;              // field[15] — 'N' active
  daId: string;                  // field[16] — Data Aggregator party ID
  daStatus: string;              // field[17] — 'N' active
  field18: string;               // spare
  field19: string;               // spare
  field20: string;               // spare
  field21: string;               // spare
  field22: string;               // spare
  newConnectionFlag: string;     // field[23] — 'N'
}

export interface D0260Model {
  envelope: DFlowEnvelope;
  record758: D0260_758;
}

export function buildD0260(model: D0260Model): DFlowFile {
  const { envelope, record758: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      // 757 batch header — file identifier matches ZHV[2]
      { recordType: '757', fields: [envelope.fileId] },
      // 758 meter point data record
      {
        recordType: '758',
        fields: [
          r.mddReference,
          r.supplierId,
          r.mpan,
          r.effectiveDate,
          r.customerClassification,
          r.energisationStatus,
          r.measurementClass,
          r.llfClass,
          r.profileClass,
          r.ssc,
          r.mobId,
          r.mobStatus,
          r.dcId,
          r.dcStatus,
          r.daId,
          r.daStatus,
          r.field18,
          r.field19,
          r.field20,
          r.field21,
          r.field22,
          r.newConnectionFlag,
        ],
      },
    ],
  };
}
