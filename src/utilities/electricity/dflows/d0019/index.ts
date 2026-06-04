// D0019 — Annualised Advance Notification (MOP → Supplier)
// File structure: ZHV → ZPI → ZIN → ISD → AAH → AAD×N → REG → PSC → IMC → GSP → IES → ZPT
//
// Sample (single register):
//   ZHV|S090176187|D0019001|B|UDMS|X|GMTR|20260515160000||||OPER|
//   ZPI|4596|
//   ZIN|13058|NH09|1100013222946|||
//   ISD|20260518|
//   AAH|20250518|20260518|
//   AAD|00001|12008.8|
//   REG|20260518|GMTR|
//   PSC|20260518|3|0393|
//   IMC|20260518|A|
//   GSP|20260518|_B|
//   IES|20260518|E|
//   ZPT|S090176187|10||1|20260515160000|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0019AAD {
  timePatternRegiment: string; // AAD[0]
  annualisedAdvance: string;   // AAD[1] — EAC kWh
}

export interface D0019Model {
  envelope: DFlowEnvelope;
  fileSequenceNumber: string;  // ZPI[0]
  instructionNumber: string;   // ZIN[0]
  typeCode: string;            // ZIN[1]
  mpan: string;                // ZIN[2]
  cosDate: string;             // ISD / AAH / REG / PSC / IMC / GSP / IES — YYYYMMDD
  supplierParticipantId: string; // REG[1]
  profileClass: string;        // PSC[1]
  ssc: string;                 // PSC[2]
  measurementClass: string;    // IMC[1]
  gspGroupId: string;          // GSP[1]
  energisationStatus: string;  // IES[1]
  aadRecords: D0019AAD[];      // one AAD row per register
}

function subtractOneYear(yyyymmdd: string): string {
  const d = new Date(
    parseInt(yyyymmdd.slice(0, 4)),
    parseInt(yyyymmdd.slice(4, 6)) - 1,
    parseInt(yyyymmdd.slice(6, 8)),
  );
  d.setFullYear(d.getFullYear() - 1);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

export function buildD0019(model: D0019Model): DFlowFile {
  const { envelope: env, ...r } = model;
  const cosDateMinus1Y = subtractOneYear(r.cosDate);

  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: 'ZPI', fields: [r.fileSequenceNumber] },
      { recordType: 'ZIN', fields: [r.instructionNumber, r.typeCode, r.mpan, '', ''] },
      { recordType: 'ISD', fields: [r.cosDate] },
      { recordType: 'AAH', fields: [cosDateMinus1Y, r.cosDate] },
      ...r.aadRecords.map(aad => ({
        recordType: 'AAD',
        fields: [aad.timePatternRegiment, aad.annualisedAdvance],
      })),
      { recordType: 'REG', fields: [r.cosDate, r.supplierParticipantId] },
      { recordType: 'PSC', fields: [r.cosDate, r.profileClass, r.ssc] },
      { recordType: 'IMC', fields: [r.cosDate, r.measurementClass] },
      { recordType: 'GSP', fields: [r.cosDate, r.gspGroupId] },
      { recordType: 'IES', fields: [r.cosDate, r.energisationStatus] },
    ],
  };
}
