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
  instructionNumber: string;       // field[2]  — up to 10-digit integer reference
  instructionType: string;         // field[3]  — e.g. 'SP43'
  mpan: string;                    // field[4]  — 13-digit MPAN
  cosDate: string;                 // field[5]  — Change of Supplier date YYYYMMDD
  oldSupplierParticipantId: string;// field[6]  — Old supplier participant ID
  energisationStatus: string;      // field[7]  — 'E' | 'D'
  measurementClass: string;        // field[8]  — 'A'–'I'
  mtc: string;                     // field[9]  — Meter Timeswitch Code
  profileClass: string;            // field[10] — '01'–'08'
  ssc: string;                     // field[11] — Standard Settlement Config
  aggrParticipantId: string;       // field[12] — Data Aggregator participant ID
  aggrType: string;                // field[13] — 'H' | 'N'
  collectorParticipantId: string;  // field[14] — Data Collector participant ID
  collectorType: string;           // field[15] — 'H' | 'N'
  mopParticipantId: string;        // field[16] — Meter Operator participant ID
  mopType: string;                 // field[17] — 'H' | 'N'
  field18: string;
  field19: string;
  field20: string;
  field21: string;
  field22: string;
  relatedMpanIndicator: string;    // field[23] — 'N'
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
          r.instructionNumber,
          r.instructionType,
          r.mpan,
          r.cosDate,
          r.oldSupplierParticipantId,
          r.energisationStatus,
          r.measurementClass,
          r.mtc,
          r.profileClass,
          r.ssc,
          r.aggrParticipantId,
          r.aggrType,
          r.collectorParticipantId,
          r.collectorType,
          r.mopParticipantId,
          r.mopType,
          r.field18,
          r.field19,
          r.field20,
          r.field21,
          r.field22,
          r.relatedMpanIndicator,
        ],
      },
    ],
  };
}
