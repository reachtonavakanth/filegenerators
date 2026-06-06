// D0268 — HH Meter Technical Details (Standing Data Notification)
// File structure: ZHV → 01A → (02A + 03A + 04A)×N → ZPT
//
// Sample (single meter block):
//   ZHV|MI19074296|D0268002|M|SWEB|X|GMTR|20260206142000||||OPER|
//   01A|1014568234275|20260604|5|6|F||415|3|H||
//   02A|K18TB00631|VIS||3|6|001||DVTUPNFS||************||************||IP|GS|I|10.132.225.232:8080|00345901020715250|9600|OTWO|8934076100164754318|||
//   03A|K21W003729|ABB LV CT MU Vision (Cl 1) type FB/TB|20260604|||200/5|3P4W|A|20260604|SIEM|
//   04A|10|K18TB00631|006|1.000000|1.00|1.0000|RE|6|||
//   ZPT|MI19074296|4||1|20260206145200|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope, DFlowRecord } from '../../../../shared/domain/types';

export interface D0268MeterBlock {
  // 02A — Outstation Details
  outstationId: string;               // 02A[1] — e.g. MSNO1
  outstationType: string;             // 02A[2] — default VIS
  modemType: string;                  // 02A[3] — optional
  outstationChannels: string;         // 02A[4] — default 3
  outstationDials: string;            // 02A[5]
  outstationPin: string;              // 02A[6] — optional
  usernameL1: string;                 // 02A[7] — optional
  passwordL1: string;                 // 02A[8] — optional
  usernameL2: string;                 // 02A[9] — optional
  passwordL2: string;                 // 02A[10] — optional
  usernameL3: string;                 // 02A[11] — optional
  passwordL3: string;                 // 02A[12] — optional
  readerPassword: string;             // 02A[13] — optional
  commAddressType: string;            // 02A[14] — default IP
  commMethodB: string;                // 02A[15] — optional
  dialIndicator: string;              // 02A[16] — optional
  commAddress: string;                // 02A[17] — optional
  commAddressB: string;               // 02A[18] — optional
  baudRate: string;                   // 02A[19] — optional
  commProvider: string;               // 02A[20] — optional
  simSerial: string;                  // 02A[21] — optional
  seqMpan: string;                    // 02A[22] — optional
  seqOutstationId: string;            // 02A[23] — optional

  // 03A — Meter Details
  msn: string;                        // 03A[1]
  manufacturersMakeAndType: string;   // 03A[2] — optional
  meterInstalledDate: string;         // 03A[3]
  meterCurrentRating: string;         // 03A[4] — optional
  vtRatio: string;                    // 03A[5] — optional
  ctRatio: string;                    // 03A[6] — optional
  phaseWire: string;                  // 03A[7] — optional
  feederStatus: string;               // 03A[8] — default A
  feederStatusEffectiveDate: string;  // 03A[9]
  meterAssetProviderId: string;       // 03A[10]

  // 04A — Meter Register Details
  meterRegisterId: string;            // 04A[1] — default 10
  channelNumber: string;              // 04A[3] — default 006
  pulseMultiplier: string;            // 04A[4] — default 1.000000
  meterRegisterMultiplier: string;    // 04A[5] — default 1.00
  outstationMultiplier: string;       // 04A[6] — default 1.0000
  measurementQuantityId: string;      // 04A[7]
  numberOfRegisterDigits: string;     // 04A[8] — default 6
  associatedMeterId: string;          // 04A[9] — optional
  associatedMeterRegisterId: string;  // 04A[10] — optional
}

export interface D0268Model {
  envelope: DFlowEnvelope;
  // 01A — Supply Point / Meter COP Details
  mpan: string;                   // 01A[1]
  cosDate: string;                // 01A[2]
  meterCop: string;               // 01A[3] — default 5
  meterCopIssueNumber: string;    // 01A[4] — default 6
  complexSiteIndicator: string;   // 01A[5] — T/F, default F
  systemVoltage: string;          // 01A[7] — default 415
  numberOfPhases: string;         // 01A[8] — 1/2/3, default 3
  eventIndicator: string;         // 01A[9] — default J
  meterBlocks: D0268MeterBlock[]; // 02A+03A+04A repeated per meter
}

export function buildD0268(model: D0268Model): DFlowFile {
  const { envelope: env, ...r } = model;
  const records: DFlowRecord[] = [];

  // 01A — one per file
  records.push({
    recordType: '01A',
    fields: [
      r.mpan, r.cosDate, r.meterCop, r.meterCopIssueNumber,
      r.complexSiteIndicator, '', r.systemVoltage, r.numberOfPhases, r.eventIndicator,
    ],
  });

  // 02A + 03A + 04A — one set per meter block
  for (const b of r.meterBlocks) {
    records.push({
      recordType: '02A',
      fields: [
        b.outstationId, b.outstationType, b.modemType,
        b.outstationChannels, b.outstationDials, b.outstationPin,
        b.usernameL1, b.passwordL1, b.usernameL2, b.passwordL2,
        b.usernameL3, b.passwordL3, b.readerPassword,
        b.commAddressType, b.commMethodB, b.dialIndicator,
        b.commAddress, b.commAddressB, b.baudRate,
        b.commProvider, b.simSerial, b.seqMpan, b.seqOutstationId,
      ],
    });
    records.push({
      recordType: '03A',
      fields: [
        b.msn, b.manufacturersMakeAndType, b.meterInstalledDate,
        b.meterCurrentRating, b.vtRatio, b.ctRatio, b.phaseWire,
        b.feederStatus, b.feederStatusEffectiveDate, b.meterAssetProviderId,
      ],
    });
    records.push({
      recordType: '04A',
      fields: [
        b.meterRegisterId, b.outstationId, b.channelNumber,
        b.pulseMultiplier, b.meterRegisterMultiplier, b.outstationMultiplier,
        b.measurementQuantityId, b.numberOfRegisterDigits,
        b.associatedMeterId, b.associatedMeterRegisterId,
      ],
    });
  }

  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records,
  };
}
