// D0150 — NHH Meter Standing Data
// File structure: ZHV → 288 → 289 → [290 → 291 → 293×N]×M → ZPT
//
// Sample (two meter groups, one register each):
//   ZHV|0000833556|D0150002|M|BMET|X|GMTR|20260515140101||||OPER|
//   288|1100013222946|20260515||E|
//   289|0393|20260515|||
//   290|E12Z070779|||5|J|EDMI AtlasMk10A|UFUN|||||||||||RCAMY|20260515|20260315||||R|20260515|
//   291|200/5|
//   293|S|C|AI|1.00||7|||
//   290|E12Z070780|||5|J|EDMI AtlasMk10A|UFUN|||||||||||RCAMY|20260515|20260315||||R|20260515|
//   291|200/5|
//   293|01|C|AI|1.00||7|||
//   ZPT|0000833556|8||1|20260515140101|

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0150Register {
  registerId: string;                // 293[0]
  meterRegisterType: string;         // 293[1] — C/M/1/2/3/4
  measurementQuantityId: string;     // 293[2] — AI/AE/RI/RE/UN
  registerMappingCoefficient: string;// 293[3] — NUM(9,2) e.g. 1.00
  numberOfDigits: string;            // 293[5]
}

export interface D0150MeterGroup {
  msn: string;                          // 290[0]
  meterLocation: string;                // 290[4]
  manufacturersMakeAndType: string;     // 290[5]
  meterAssetProviderId: string;         // 290[6]
  meterType: string;                    // 290[17]
  meterInstalledDate: string;           // 290[18]
  certificationDate: string;            // 290[19]
  retrievalMethod: string;              // 290[23]
  retrievalMethodEffectiveDate: string; // 290[24]
  ctRatio: string;                      // 291[0]
  registers: D0150Register[];           // one 293 row per register
}

export interface D0150Model {
  envelope: DFlowEnvelope;
  mpan: string;               // 288[0]
  cosDate: string;            // 288[1]
  energisationStatus: string; // 288[3]
  ssc: string;                // 289[0]
  sconDate: string;           // 289[1]
  meterGroups: D0150MeterGroup[];
}

export function buildD0150(model: D0150Model): DFlowFile {
  const { envelope: env, ...r } = model;
  return {
    envelope: env,
    fileName: `${env.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '288', fields: [r.mpan, r.cosDate, '', r.energisationStatus] },
      { recordType: '289', fields: [r.ssc, r.sconDate, '', ''] },
      ...r.meterGroups.flatMap(group => [
        {
          recordType: '290',
          fields: [
            group.msn, '', '', '5',
            group.meterLocation, group.manufacturersMakeAndType, group.meterAssetProviderId,
            '', '', '', '', '', '', '', '', '', '',
            group.meterType, group.meterInstalledDate, group.certificationDate,
            '', '', '',
            group.retrievalMethod, group.retrievalMethodEffectiveDate,
          ],
        },
        { recordType: '291', fields: [group.ctRatio] },
        ...group.registers.map(reg => ({
          recordType: '293',
          fields: [reg.registerId, reg.meterRegisterType, reg.measurementQuantityId, reg.registerMappingCoefficient, '', reg.numberOfDigits, '', ''],
        })),
      ]),
    ],
  };
}
