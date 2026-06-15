// ============================================================
// Electricity COS Registration — Process Orchestrator
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityCOSRegistrationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';
import { STANDING_DATA_STATUS_ACTIVE } from '../../industry-constants';

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
  generateCssTimestamps,
} from '../../css/builders';


function makeEnvelope(
  m: ElectricityCOSRegistrationModel,
  hhmmss: string,
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
    creationDateTime: makeDateTime(m.fileDate, hhmmss),
    testFlag: m.testFlag,
    dataFlowId: flowId,
  };
}

export function orchestrateCOSRegistration(
  m: ElectricityCOSRegistrationModel
): GeneratedOutput {
  const [ts0, ts1, ts2, ts3] = generateCssTimestamps(4, m.timestampFormat);
  const hhmmss = currentHHMMSS();
  const fileIdBase = generateFileIdBase();
  const group0 = m.meterGroups[0];
  const reg0 = group0.registers[0];

  const mpas = [m.mpasRoleCode, m.mpasParticipantId]         as const;
  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const da   = [m.daRoleCode, m.daParticipantId]             as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  const env = (flowId: string, idx: number, seq: string, from: readonly [string, string], to: readonly [string, string]) =>
    makeEnvelope(m, hhmmss, flowId, fileIdBase, idx, seq, from[0], from[1], to[0], to[1]);

  // ---- CSS messages ----
  const css02380 = buildCSS02380_01({
    mpxn: m.mpan,
    registrationRequestId: m.registrationRequestId,
    supplierGeneratedReference: m.supplierGeneratedReference,
    correlationId: m.cssCorrelationId,
    timestamp: ts0,
  });

  const css02300 = buildCSS02300_01({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    supplyStartDate: m.cosDate,
    registrationId: m.registrationRequestId,
    supplierRole: m.supplierRoleCode,
    supplierMpid: m.supplierParticipantId,
    correlationId: m.cssCorrelationId,
    timestamp: ts1,
    registrationDate: m.registrationDate,
  });

  const css02370_01 = buildCSS02370_01({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    registrationActiveDate: m.cosDate,
    correlationId: m.cssCorrelationId,
    timestamp: ts2,
    registrationDate: m.registrationDate,
  });

  const css02370_03 = buildCSS02370_03({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    correlationId: m.cssCorrelationId,
    timestamp: ts3,
    registrationDate: m.registrationDate,
  });

  // ---- D0260 ----
  const d0260 = buildD0260({
    envelope: env('D0260', 1, '002', mpas, supp),
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

  // ---- D0217 ----
  const d0217 = buildD0217({
    envelope: env('D0217', 2, '002', mpas, supp),
    record492: {
      instructionNumber: m.instructionNumber,
      instructionType: m.d0217InstructionType,
      mpan: m.mpan,
      currentDate: m.cosDate,
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

  // ---- D0011 ----
  const d0011_mop = buildD0011({
    envelope: env('D0011', 3, '001', mop, supp),
    appointmentType: 'MOP',
    record034: { mpan: m.mpan, contractRef: m.contractRefMop, cosDate: m.cosDate },
    appointmentDate: m.cosDate,
    serviceRef: m.mopServiceRef,
    serviceLevelRef: m.mopServiceLevelRef,
  });
  d0011_mop.fileName = `D0011_MOP_${m.fileDate}_001.usr`;

  const d0011_dc = buildD0011({
    envelope: env('D0011', 4, '001', dc, supp),
    appointmentType: 'DC',
    record034: { mpan: m.mpan, contractRef: m.contractRefDc, cosDate: m.cosDate },
    appointmentDate: m.cosDate,
    serviceRef: m.dcServiceRef,
    serviceLevelRef: m.dcServiceLevelRef,
  });
  d0011_dc.fileName = `D0011_DC_${m.fileDate}_001.usr`;

  const d0011_da = buildD0011({
    envelope: env('D0011', 5, '001', da, supp),
    appointmentType: 'DA',
    record034: { mpan: m.mpan, contractRef: m.contractRefDa, cosDate: m.cosDate },
    appointmentDate: m.cosDate,
    serviceRef: m.daServiceRef,
    serviceLevelRef: m.daServiceLevelRef,
  });
  d0011_da.fileName = `D0011_DA_${m.fileDate}_001.usr`;

  // ---- D0149: 778+283+284×N per TPR group ----
  const d0149 = buildD0149({
    envelope: env('D0149', 6, '001', mop, supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    ssc: m.ssc,
    sconDate: m.sconDate,
    tprGroups: m.meterGroups.map(g => ({
      timePatternRegiment: g.timePatternRegiment,
      msn: g.msn,
      registers: g.registers.map(r => ({
        registerId: r.registerId,
        registerCoefficient: r.d0149RegisterCoefficient,
      })),
    })),
  });

  // ---- D0150: 290+291+293×N per meter group ----
  const d0150 = buildD0150({
    envelope: env('D0150', 7, '002', mop, supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    energisationStatus: m.energisationStatus,
    ssc: m.ssc,
    sconDate: m.sconDate,
    meterGroups: m.meterGroups.map(g => ({
      msn: g.msn,
      meterLocation: g.meterLocation,
      manufacturersMakeAndType: g.manufacturersMakeAndType,
      meterAssetProviderId: g.meterAssetProviderId,
      meterType: g.meterType,
      meterInstalledDate: g.meterInstalledDate,
      certificationDate: g.certificationDate,
      retrievalMethod: g.retrievalMethod,
      retrievalMethodEffectiveDate: g.retrievalMethodEffectiveDate,
      ctRatio: g.ctRatio,
      registers: g.registers.map(r => ({
        registerId: r.registerId,
        meterRegisterType: r.meterRegisterType,
        measurementQuantityId: r.measurementQuantityId,
        registerMappingCoefficient: r.registerMappingCoefficient,
        numberOfDigits: r.numberOfDigits,
      })),
    })),
  });

  // ---- D0052: one 124 per register, TPR carried per row ----
  const d0052 = buildD0052({
    envelope: env('D0052', 8, '001', supp, dc),
    mpan: m.mpan,
    cosDate: m.cosDate,
    profileClass: m.profileClass,
    measurementClass: m.measurementClass,
    ssc: m.ssc,
    gspGroupId: m.gspGroupId,
    registers: m.meterGroups.flatMap(g => g.registers.map(r => ({
      timePatternRegiment: g.timePatternRegiment,
      estimatedAnnualConsumption: r.estimatedAnnualConsumption,
    }))),
  });

  // ---- D0010: one 030 per register across all groups ----
  const d0010 = buildD0010({
    envelope: env('D0010', 9, '002', dc, supp),
    mpan: m.mpan,
    bscValidationStatus: reg0.bscValidationStatus,
    msn: group0.msn,
    readingType: reg0.readingType,
    registers: m.meterGroups.flatMap(g => g.registers.map(r => ({
      registerId: r.registerId,
      readingDateTime: r.readingDate + '000000',
      readingValue: r.readingValue,
      meterReadingFlag: r.meterReadingFlag,
      readingMethod: r.readingMethod,
    }))),
  });

  // ---- D0086: one 198 per register across all groups ----
  const d0086 = buildD0086({
    envelope: env('D0086', 10, '002', dc, supp),
    mpan: m.mpan,
    bscValidationStatus: reg0.bscValidationStatus,
    msn: group0.msn,
    readingType: reg0.readingType,
    registers: m.meterGroups.flatMap(g => g.registers.map(r => ({
      registerId: r.registerId,
      readingDateTime: r.readingDate + '000000',
      readingValue: r.readingValue,
      meterReadingFlag: r.meterReadingFlag,
      readingMethod: r.readingMethod,
    }))),
  });

  // ---- D0012 ----
  const d0012 = buildD0012({
    envelope: env('D0012', 11, '001', dc, supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    regularReadingCycle: m.regularReadingCycle,
  });

  // ---- D0019: one EAD/AAD row per register, TPR carried per row ----
  const d0019 = buildD0019({
    envelope: env('D0019', 12, '001', mop, supp),
    fileSequenceNumber: String(fileIdBase % 9999 + 1),
    instructionNumber: m.instructionNumber,
    typeCode: 'NH09',
    mpan: m.mpan,
    cosDate: m.cosDate,
    supplierParticipantId: m.supplierParticipantId,
    profileClass: m.profileClass,
    ssc: m.ssc,
    measurementClass: m.measurementClass,
    gspGroupId: m.gspGroupId,
    energisationStatus: m.energisationStatus,
    consumptionType: m.d0019ConsumptionType,
    eadRecords: m.meterGroups.flatMap(g => g.registers.map(r => ({
      timePatternRegiment: g.timePatternRegiment,
      estimatedAnnualConsumption: r.estimatedAnnualConsumption,
      actualAnnualConsumption: r.actualAnnualConsumption ?? '',
    }))),
  });

  return {
    processId: 'cos-registration',
    processLabel: 'Electricity NHH COS Registration',
    folderName: `${m.mpan}_NHH COS Registration`,
    dflows: [
      d0260, d0217,
      d0011_mop, d0011_da, d0011_dc,
      d0149, d0150, d0052,
      d0010, d0086, d0012, d0019,
    ],
    cssMessages: [css02300, css02380, css02370_01, css02370_03],
  };
}
