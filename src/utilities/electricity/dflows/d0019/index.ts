// D0019 — Estimated / Actual Advance Notification (MOP → Supplier)
//
// consumptionType === 'estimated' (default):
//   ISD → EAH|cosDate| → EAD×N
//
// consumptionType === 'actual':
//   ISD → AAH|(cosDate-1)-1yr|(cosDate-1)| → AAD×N → EAH|cosDate| → EAD×N

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowRecord } from '../../../../shared/domain/types';

export interface D0019EAD {
  timePatternRegiment: string;
  estimatedAnnualConsumption: string;
  actualAnnualConsumption?: string; // required when consumptionType === 'actual'
}

export interface D0019Model {
  envelope: import('../../../../shared/domain/types').DFlowEnvelope;
  fileSequenceNumber: string;      // ZPI[0]
  instructionNumber: string;       // ZIN[0]
  typeCode: string;                // ZIN[1]
  mpan: string;                    // ZIN[2]
  cosDate: string;                 // ISD / EAH / AAH — YYYYMMDD
  supplierParticipantId: string;   // REG[1]
  profileClass: string;            // PSC[1]
  ssc: string;                     // PSC[2]
  measurementClass: string;        // IMC[1]
  gspGroupId: string;              // GSP[1]
  energisationStatus: string;      // IES[1]
  eadRecords: D0019EAD[];          // one row per register / TPR
  consumptionType?: 'estimated' | 'actual'; // default: 'estimated'
}

function subtractOneDay(yyyymmdd: string): string {
  const d = new Date(
    parseInt(yyyymmdd.slice(0, 4)),
    parseInt(yyyymmdd.slice(4, 6)) - 1,
    parseInt(yyyymmdd.slice(6, 8)),
  );
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
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
  const isActual = r.consumptionType === 'actual';

  let advanceBlock: DFlowRecord[];

  if (isActual) {
    const cosDateMinusOne = subtractOneDay(r.cosDate);
    const aahStart = subtractOneYear(cosDateMinusOne);
    advanceBlock = [
      { recordType: 'AAH', fields: [aahStart, cosDateMinusOne] },
      ...r.eadRecords.map((ead: D0019EAD) => ({
        recordType: 'AAD',
        fields: [ead.timePatternRegiment, ead.actualAnnualConsumption ?? ''],
      })),
      { recordType: 'EAH', fields: [r.cosDate] },
      ...r.eadRecords.map((ead: D0019EAD) => ({
        recordType: 'EAD',
        fields: [ead.timePatternRegiment, ead.estimatedAnnualConsumption],
      })),
    ];
  } else {
    advanceBlock = [
      { recordType: 'EAH', fields: [r.cosDate] },
      ...r.eadRecords.map((ead: D0019EAD) => ({
        recordType: 'EAD',
        fields: [ead.timePatternRegiment, ead.estimatedAnnualConsumption],
      })),
    ];
  }

  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: 'ZPI', fields: [r.fileSequenceNumber] },
      { recordType: 'ZIN', fields: [r.instructionNumber, r.typeCode, r.mpan, '', ''] },
      { recordType: 'ISD', fields: [r.cosDate] },
      ...advanceBlock,
      { recordType: 'REG', fields: [r.cosDate, r.supplierParticipantId] },
      { recordType: 'PSC', fields: [r.cosDate, r.profileClass, r.ssc] },
      { recordType: 'IMC', fields: [r.cosDate, r.measurementClass] },
      { recordType: 'GSP', fields: [r.cosDate, r.gspGroupId] },
      { recordType: 'IES', fields: [r.cosDate, r.energisationStatus] },
    ],
  };
}
