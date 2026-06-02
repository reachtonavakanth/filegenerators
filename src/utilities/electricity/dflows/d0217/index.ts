// D0217 — Notification of Supplier Nomination
// File structure: ZHV → 754 (batch header) → 492 (notification record) → ZPT
//
// 492 field map:
// [1]instructionNumber [2]instructionType [3]mpan [4]currentDate [5]cosDate
// [6-15]blank [16]postcode [17]blank [18]llfClass [19]gspGroupId
// [20]energisationStatus [21]measurementClass [22]mtc [23]profileClass [24]ssc
// [25]aggrParticipantId [26]aggrType [27]collectorParticipantId [28]collectorType
// [29]mopParticipantId [30]mopType [31-37]blank [38]relatedMpanIndicator

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0217_492 {
  instructionNumber: string;        // field[1]
  instructionType: string;          // field[2]  — e.g. 'SP40'
  mpan: string;                     // field[3]
  currentDate: string;              // field[4]  — file date YYYYMMDD
  cosDate: string;                  // field[5]  — Change of Supplier date YYYYMMDD
  // fields[6-15] blank
  postcode: string;                 // field[16]
  // field[17] blank
  llfClass: string;                 // field[18]
  gspGroupId: string;               // field[19]
  energisationStatus: string;       // field[20]
  measurementClass: string;         // field[21]
  mtc: string;                      // field[22]
  profileClass: string;             // field[23]
  ssc: string;                      // field[24]
  aggrParticipantId: string;        // field[25] — Data Aggregator participant ID
  aggrType: string;                 // field[26] — 'H' | 'N'
  collectorParticipantId: string;   // field[27] — Data Collector participant ID
  collectorType: string;            // field[28] — 'H' | 'N'
  mopParticipantId: string;         // field[29] — Meter Operator participant ID
  mopType: string;                  // field[30] — 'H' | 'N'
  // fields[31-37] blank
  relatedMpanIndicator: string;     // field[38]
}

export interface D0217Model {
  envelope: DFlowEnvelope;
  record492: D0217_492;
}

export function buildD0217(model: D0217Model): DFlowFile {
  const { envelope, record492: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      // 754 batch header — file identifier matches ZHV[2]
      { recordType: '754', fields: [envelope.fileId] },
      // 492 notification record
      {
        recordType: '492',
        fields: [
          r.instructionNumber,
          r.instructionType,
          r.mpan,
          r.currentDate,
          r.cosDate,
          '', '', '', '', '', '', '', '', '', '', // fields[6-15] blank
          r.postcode,
          '',               // field[17] blank
          r.llfClass,
          r.gspGroupId,
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
          '', '', '', '', '', '', '', // fields[31-37] blank
          r.relatedMpanIndicator,
        ],
      },
    ],
  };
}
