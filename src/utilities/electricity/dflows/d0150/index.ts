// D0150 — NHH Meter Standing Data
// File structure: ZHV → 288 → 289 → 290 → 291 → 293 → ZPT
//
// Sample: ZHV|0000833556|D0150002|M|BMET|X|GMTR|20260515140101||||OPER|
//         288|1100013222946|20260515||E|
//         289|0393|20260515|||
//         290|E12Z070779|||5|J|EDMI AtlasMk10A|UFUN|||||||||||RCAMY|20260515|20260315||||R|20260515|
//         291|200/5|
//         293|S|C|AI|1.00||7|||
//         ZPT|0000833556|5||1|20260515140101|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0150Model {
  envelope: DFlowEnvelope;
  // 288 / 289 shared header fields
  mpan: string;                        // 288[1]
  cosDate: string;                     // 288[2], 289[2] — YYYYMMDD
  energisationStatus: string;          // 288[4] — 'E' | 'D'
  ssc: string;                         // 289[1] — Standard Settlement Config
  // 290 meter equipment fields
  msn: string;                         // 290[0] — Meter Serial Number
  meterLocation: string;               // 290[4] — A–Z location code
  manufacturersMakeAndType: string;    // 290[5] — e.g. 'EDMI AtlasMk10A'
  meterAssetProviderId: string;        // 290[6] — MAP ID e.g. 'UFUN'
  meterType: string;                   // 290[17] — MAP meter type code e.g. 'RCAMY'
  meterInstalledDate: string;          // 290[18] — YYYYMMDD
  certificationDate: string;           // 290[19] — YYYYMMDD
  retrievalMethod: string;             // 290[23] — H/M/N/R/S/U
  retrievalMethodEffectiveDate: string;// 290[24] — YYYYMMDD
  // 291 CT ratio
  ctRatio: string;                     // 291[0] — e.g. '200/5'
  // 293 register record
  registerId: string;                  // 293[0] — 'S' or '01'
  meterRegisterType: string;           // 293[1] — C/M/1/2/3/4
  measurementQuantityId: string;       // 293[2] — AI/AE/RI/RE/UN
  registerMappingCoefficient: string;  // 293[3] — e.g. '1.00' NUM(9,2)
  numberOfDigits: string;              // 293[5] — e.g. '7'
}

export function buildD0150(model: D0150Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      // 288: MPAN | COS Date | (empty) | Energisation Status
      { recordType: '288', fields: [r.mpan, r.cosDate, '', r.energisationStatus] },
      // 289: SSC | COS Date | (empty) | (empty)
      { recordType: '289', fields: [r.ssc, r.cosDate, '', ''] },
      // 290: MSN | | | Meter Current Rating(5) | Location | Make&Type | MAP ID | (×10 empty) | Meter Type | Install Date | Cert Date | | | | Retrieval Method | Retrieval Eff. Date
      {
        recordType: '290',
        fields: [
          r.msn,
          '', '',
          '5',  // Meter Current Rating — placeholder per spec
          r.meterLocation,
          r.manufacturersMakeAndType,
          r.meterAssetProviderId,
          '', '', '', '', '', '', '', '', '', '',  // 10 empty fields (indices 7–16)
          r.meterType,
          r.meterInstalledDate,
          r.certificationDate,
          '', '', '',  // 3 empty fields (indices 20–22)
          r.retrievalMethod,
          r.retrievalMethodEffectiveDate,
        ],
      },
      // 291: CT Ratio
      { recordType: '291', fields: [r.ctRatio] },
      // 293: Register ID | Register Type | MQI | Multiplier | (empty) | Digits | (empty) | (empty)
      {
        recordType: '293',
        fields: [
          r.registerId,
          r.meterRegisterType,
          r.measurementQuantityId,
          r.registerMappingCoefficient,
          '',
          r.numberOfDigits,
          '', '',
        ],
      },
    ],
  };
}
