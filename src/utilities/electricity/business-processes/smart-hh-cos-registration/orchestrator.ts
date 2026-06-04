// ============================================================
// Electricity Smart HH COS Registration — Process Orchestrator
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricitySmartHHCOSRegistrationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';
import {
  STANDING_DATA_STATUS_ACTIVE, VALIDATION_METHOD_VRA,
} from '../../industry-constants';

import { buildD0260 } from '../../dflows/d0260';
import { buildD0217 } from '../../dflows/d0217';
import { buildD0011 } from '../../dflows/d0011';
import { buildD0149 } from '../../dflows/d0149';
import { buildD0150 } from '../../dflows/d0150';
import { buildD0052 } from '../../dflows/d0052';
import { buildD0010 } from '../../dflows/d0010';
import { buildD0086 } from '../../dflows/d0086';
import { buildD0012 } from '../../dflows/d0012';
import { buildD0019 } from '../../dflows/d0019';
import {
  buildCSS02300_01,
  buildCSS02380_01,
  buildCSS02370_01,
  buildCSS02370_03,
} from '../../css/builders';


function makeEnvelope(
  m: ElectricitySmartHHCOSRegistrationModel,
  flowId: string,
  fileIdBase: number,
  fileIndex: number,
  xRefSeq: string,
  fromRoleCode: string,
  fromParticipantId: string,
  toRoleCode: string,
  toParticipantId: string,
): DFlowEnvelope {
  return {
    fileId: String(fileIdBase + fileIndex),
    xRef: makeXRef(flowId, xRefSeq),
    fromRoleCode,
    fromParticipantId,
    toRoleCode,
    toParticipantId,
    creationDateTime: makeDateTime(m.fileDate, currentHHMMSS()),
    testFlag: m.testFlag,
    dataFlowId: flowId,
  };
}

function localISOString(): string {
  const d = new Date();
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

export function orchestrateSmartHHCOSRegistration(
  m: ElectricitySmartHHCOSRegistrationModel
): GeneratedOutput {
  const ts = m.timestampFormat === 'local' ? localISOString() : new Date().toISOString();
  const fileIdBase = generateFileIdBase();
  const reg0 = m.registers[0];

  const mpas = [m.mpasRoleCode, m.mpasParticipantId]         as const;
  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const da   = [m.daRoleCode, m.daParticipantId]             as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  const css02380 = buildCSS02380_01({
    mpxn: m.mpan,
    registrationRequestId: m.registrationRequestId,
    supplierGeneratedReference: m.supplierGeneratedReference,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
  });

  const css02300 = buildCSS02300_01({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    supplyStartDate: m.cosDate,
    registrationId: m.registrationRequestId,
    supplierRole: m.supplierRoleCode,
    supplierMpid: m.supplierParticipantId,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
    registrationDate: m.registrationDate,
  });

  const css02370_01 = buildCSS02370_01({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    registrationActiveDate: m.cosDate,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
    registrationDate: m.registrationDate,
  });

  const css02370_03 = buildCSS02370_03({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
    registrationDate: m.registrationDate,
  });

  const d0260 = buildD0260({
    envelope: makeEnvelope(m, 'D0260', fileIdBase, 1, '002', ...mpas, ...supp),
    record758: {
      instructionNumber: m.instructionNumber,
      instructionType: m.instructionType,
      mpan: m.mpan,
      cosDate: m.cosDate,
      oldSupplierParticipantId: m.oldSupplierParticipantId,
      energisationStatus: m.energisationStatus,
      measurementClass: m.measurementClass,
      mtc: m.mtc,
      profileClass: m.profileClass,
      ssc: m.ssc,
      aggrParticipantId: m.daParticipantId,
      aggrType: m.aggrType,
      collectorParticipantId: m.dcParticipantId,
      collectorType: m.collectorType,
      mopParticipantId: m.mopParticipantId,
      mopType: m.mopType,
      field18: '', field19: '', field20: '', field21: '', field22: '',
      relatedMpanIndicator: STANDING_DATA_STATUS_ACTIVE,
    },
  });

  const d0217 = buildD0217({
    envelope: makeEnvelope(m, 'D0217', fileIdBase, 2, '002', ...mpas, ...supp),
    record492: {
      instructionNumber: m.instructionNumber,
      instructionType: m.d0217InstructionType,
      mpan: m.mpan,
      currentDate: m.fileDate,
      cosDate: m.cosDate,
      postcode: m.postcode,
      llfClass: m.llfClass,
      gspGroupId: m.gspGroupId,
      energisationStatus: m.energisationStatus,
      measurementClass: m.measurementClass,
      mtc: m.mtc,
      profileClass: m.profileClass,
      ssc: m.ssc,
      aggrParticipantId: m.daParticipantId,
      aggrType: m.aggrType,
      collectorParticipantId: m.dcParticipantId,
      collectorType: m.collectorType,
      mopParticipantId: m.mopParticipantId,
      mopType: m.mopType,
      relatedMpanIndicator: STANDING_DATA_STATUS_ACTIVE,
    },
  });

  const d0011Common = {
    record034: { mpan: m.mpan, contractRef: m.appointmentRef, cosDate: m.cosDate },
    appointmentDate: m.cosDate,
    registerRef: m.registerCode,
  };

  const d0011_mop = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 3, '001', ...mop, ...supp),
    appointmentType: 'MOP',
    ...d0011Common,
  });
  d0011_mop.fileName = `D0011_MOP_${m.fileDate}_001.usr`;

  const d0011_dc = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 4, '002', ...dc, ...supp),
    appointmentType: 'DC',
    ...d0011Common,
  });
  d0011_dc.fileName = `D0011_DC_${m.fileDate}_001.usr`;

  const d0011_da = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 5, '003', ...da, ...supp),
    appointmentType: 'DA',
    ...d0011Common,
  });
  d0011_da.fileName = `D0011_DA_${m.fileDate}_001.usr`;

  // ---- D0149: one 284 row per register ----
  const d0149 = buildD0149({
    envelope: makeEnvelope(m, 'D0149', fileIdBase, 6, '001', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    ssc: m.ssc,
    sconDate: m.sconDate,
    timePatternRegiment: m.timePatternRegiment,
    msn: m.msn,
    registers: m.registers.map(r => ({
      registerId: r.registerId,
      registerCoefficient: r.d0149RegisterCoefficient,
    })),
  });

  // ---- D0150: one 293 row per register ----
  const d0150 = buildD0150({
    envelope: makeEnvelope(m, 'D0150', fileIdBase, 7, '002', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    energisationStatus: m.energisationStatus,
    ssc: m.ssc,
    sconDate: m.sconDate,
    msn: m.msn,
    meterLocation: m.meterLocation,
    manufacturersMakeAndType: m.manufacturersMakeAndType,
    meterAssetProviderId: m.meterAssetProviderId,
    meterType: m.meterType,
    meterInstalledDate: m.meterInstalledDate,
    certificationDate: m.certificationDate,
    retrievalMethod: m.retrievalMethod,
    retrievalMethodEffectiveDate: m.retrievalMethodEffectiveDate,
    ctRatio: m.ctPrimaryRatio,
    registers: m.registers.map(r => ({
      registerId: r.registerId,
      meterRegisterType: r.meterRegisterType,
      measurementQuantityId: r.measurementQuantityId,
      registerMappingCoefficient: r.registerMappingCoefficient,
      numberOfDigits: r.numberOfDigits,
    })),
  });

  // ---- D0052: one 124 row per register ----
  const d0052 = buildD0052({
    envelope: makeEnvelope(m, 'D0052', fileIdBase, 8, '001', ...supp, ...dc),
    mpan: m.mpan,
    cosDate: m.cosDate,
    profileClass: m.profileClass,
    measurementClass: m.measurementClass,
    ssc: m.ssc,
    gspGroupId: m.gspGroupId,
    timePatternRegiment: m.timePatternRegiment,
    registers: m.registers.map(r => ({
      estimatedAnnualConsumption: r.estimatedAnnualConsumption,
    })),
  });

  // ---- D0010: 026 + 028 once, one 030 per register ----
  const d0010 = buildD0010({
    envelope: makeEnvelope(m, 'D0010', fileIdBase, 9, '002', ...dc, ...supp),
    mpan: m.mpan,
    bscValidationStatus: reg0.bscValidationStatus,
    msn: m.msn,
    readingType: reg0.readingType,
    registers: m.registers.map(r => ({
      registerId: r.registerId,
      readingDateTime: r.readingDate + '000000',
      readingValue: r.readingValue,
      meterReadingFlag: r.meterReadingFlag,
      readingMethod: r.readingMethod,
    })),
  });

  // ---- D0086: 196 + 197 once, one 198 per register ----
  const d0086 = buildD0086({
    envelope: makeEnvelope(m, 'D0086', fileIdBase, 10, '002', ...dc, ...supp),
    mpan: m.mpan,
    bscValidationStatus: reg0.bscValidationStatus,
    msn: m.msn,
    readingType: reg0.readingType,
    registers: m.registers.map(r => ({
      registerId: r.registerId,
      readingDateTime: r.readingDate + '000000',
      readingValue: r.readingValue,
      meterReadingFlag: r.meterReadingFlag,
      readingMethod: r.readingMethod,
    })),
  });

  const d0012 = buildD0012({
    envelope: makeEnvelope(m, 'D0012', fileIdBase, 11, '001', ...dc, ...supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    regularReadingCycle: m.regularReadingCycle,
  });

  // ---- D0019: one 026 row per register ----
  const d0019 = buildD0019({
    envelope: makeEnvelope(m, 'D0019', fileIdBase, 12, '001', ...dc, ...supp),
    records026: m.registers.map(r => ({
      mpan: m.mpan,
      msn: m.msn,
      registerId: r.registerId,
      readDate: r.readingDate,
      validatedReading: r.readingValue,
      readingType: r.readingType,
      validationMethod: VALIDATION_METHOD_VRA,
      measurementQuantityId: r.measurementQuantityId,
    })),
  });

  return {
    processId: 'smart-hh-cos-registration',
    processLabel: 'Electricity Smart HH COS Registration',
    dflows: [
      d0260, d0217,
      d0011_mop, d0011_dc, d0011_da,
      d0149, d0150, d0052,
      d0010, d0086, d0012, d0019,
    ],
    cssMessages: [css02300, css02380, css02370_01, css02370_03],
  };
}
