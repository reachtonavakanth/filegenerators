// D0268 — HH Meter Technical Details (Standing Data Notification)
// File structure: ZHV → 01A → 02A×N → (03A + 04A×M)×P → ZPT
//
// Sample (single outstation, single meter with single register):
//   ZHV|MI19074296|D0268002|M|SWEB|X|GMTR|20260206142000||||OPER|
//   01A|1014568234275|20260604|5|6|F||415|3|H||
//   02A|K18TB00631|VIS||3|6|001||DVTUPNFS||************||************||IP|GS|I|10.132.225.232:8080|00345901020715250|9600|OTWO|8934076100164754318|||
//   03A|K21W003729|ABB LV CT MU Vision (Cl 1) type FB/TB|20260604|||200/5|3P4W|A|20260604|SIEM|
//   04A|10|K18TB00631|006|1.000000|1.00|1.0000|RE|6|||
//   ZPT|MI19074296|4||1|20260206145200|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope, DFlowRecord } from '../../../../shared/domain/types';

// ---- 02A — Outstation Details ----
export interface D0268Outstation {
  outstationId: string;               // 02A[1]
  outstationType: string;             // 02A[2] — default VIS
  modemType: string;                  // 02A[3] — optional
  outstationChannels: string;         // 02A[4] — default 3
  outstationDials: string;            // 02A[5]
  outstationPin: string;              // 02A[6] — optional
  usernameL1: string;                 // 02A[7]
  passwordL1: string;                 // 02A[8]
  usernameL2: string;                 // 02A[9]
  passwordL2: string;                 // 02A[10]
  usernameL3: string;                 // 02A[11]
  passwordL3: string;                 // 02A[12]
  readerPassword: string;             // 02A[13]
  commAddressType: string;            // 02A[14] — default IP
  commMethodB: string;                // 02A[15]
  dialIndicator: string;              // 02A[16]
  commAddress: string;                // 02A[17]
  commAddressB: string;               // 02A[18]
  baudRate: string;                   // 02A[19]
  commProvider: string;               // 02A[20]
  simSerial: string;                  // 02A[21]
  seqMpan: string;                    // 02A[22]
  seqOutstationId: string;            // 02A[23]
}

// ---- 04A — Meter Register Details (one or more per 03A) ----
export interface D0268MeterRegister {
  meterRegisterId: string;            // 04A[1] — default 10
  outstationId: string;               // 04A[2] — links to 02A
  channelNumber: string;              // 04A[3] — default 006
  pulseMultiplier: string;            // 04A[4] — default 1.000000
  meterRegisterMultiplier: string;    // 04A[5] — default 1.00
  outstationMultiplier: string;       // 04A[6] — default 1.0000
  measurementQuantityId: string;      // 04A[7]
  numberOfRegisterDigits: string;     // 04A[8] — default 6
  associatedMeterId: string;          // 04A[9]
  associatedMeterRegisterId: string;  // 04A[10]
}

// ---- 03A — Meter Details (one or more, each with own 04A registers) ----
export interface D0268Meter {
  msn: string;                        // 03A[1]
  manufacturersMakeAndType: string;   // 03A[2]
  meterInstalledDate: string;         // 03A[3]
  meterCurrentRating: string;         // 03A[4]
  vtRatio: string;                    // 03A[5]
  ctRatio: string;                    // 03A[6]
  phaseWire: string;                  // 03A[7]
  feederStatus: string;               // 03A[8] — default A
  feederStatusEffectiveDate: string;  // 03A[9]
  meterAssetProviderId: string;       // 03A[10]
  registers: D0268MeterRegister[];    // one or more 04A rows
}

export interface D0268Model {
  envelope: DFlowEnvelope;
  // 01A — Supply Point / Meter COP Details
  mpan: string;
  cosDate: string;
  meterCop: string;
  meterCopIssueNumber: string;
  complexSiteIndicator: string;
  meterEquipmentLocation: string;  // 01A[6]
  systemVoltage: string;
  numberOfPhases: string;
  eventIndicator: string;
  additionalInformation: string;   // 01A[10] — optional
  // 02A — independent outstations
  outstations: D0268Outstation[];
  // 03A + 04A — meters, each with their own registers
  meters: D0268Meter[];
}

export function buildD0268(model: D0268Model): DFlowFile {
  const { envelope: env, ...r } = model;
  const records: DFlowRecord[] = [];

  // 01A — once
  records.push({
    recordType: '01A',
    fields: [
      r.mpan, r.cosDate, r.meterCop, r.meterCopIssueNumber,
      r.complexSiteIndicator, r.meterEquipmentLocation, r.systemVoltage, r.numberOfPhases, r.eventIndicator,
      r.additionalInformation,
    ],
  });

  // 02A — one per outstation
  for (const o of r.outstations) {
    records.push({
      recordType: '02A',
      fields: [
        o.outstationId, o.outstationType, o.modemType,
        o.outstationChannels, o.outstationDials, o.outstationPin,
        o.usernameL1, o.passwordL1, o.usernameL2, o.passwordL2,
        o.usernameL3, o.passwordL3, o.readerPassword,
        o.commAddressType, o.commMethodB, o.dialIndicator,
        o.commAddress, o.commAddressB, o.baudRate,
        o.commProvider, o.simSerial, o.seqMpan, o.seqOutstationId,
      ],
    });
  }

  // 03A + 04A — one 03A per meter, followed by its 04A registers
  for (const m of r.meters) {
    records.push({
      recordType: '03A',
      fields: [
        m.msn, m.manufacturersMakeAndType, m.meterInstalledDate,
        m.meterCurrentRating, m.vtRatio, m.ctRatio, m.phaseWire,
        m.feederStatus, m.feederStatusEffectiveDate, m.meterAssetProviderId,
      ],
    });
    for (const reg of m.registers) {
      records.push({
        recordType: '04A',
        fields: [
          reg.meterRegisterId, reg.outstationId, reg.channelNumber,
          reg.pulseMultiplier, reg.meterRegisterMultiplier, reg.outstationMultiplier,
          reg.measurementQuantityId, reg.numberOfRegisterDigits,
          reg.associatedMeterId, reg.associatedMeterRegisterId,
        ],
      });
    }
  }

  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records,
  };
}
