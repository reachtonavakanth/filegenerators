// ============================================================
// Electricity COS Registration — Process Orchestrator
// Produces all 16 D-flow + CSS outputs for a COS Registration
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityCOSRegistrationModel } from './model';
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
  m: ElectricityCOSRegistrationModel,
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

export function orchestrateCOSRegistration(
  m: ElectricityCOSRegistrationModel
): GeneratedOutput {
  const ts = new Date().toISOString(); // ISO 8601 with milliseconds e.g. "2026-05-28T12:19:00.000Z"
  const fileIdBase = generateFileIdBase();

  // Party routing shortcuts — (fromRoleCode, fromParticipantId, toRoleCode, toParticipantId)
  const mpas = [m.mpasRoleCode, m.mpasParticipantId]         as const;
  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const da   = [m.daRoleCode, m.daParticipantId]             as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  // ---- CSS02380_01 ----
  const css02380 = buildCSS02380_01({
    mpxn: m.mpan,
    registrationRequestId: m.registrationRequestId,
    supplierGeneratedReference: m.supplierGeneratedReference,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
  });

  // ---- CSS02300_01 ----
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

  // ---- CSS02370_01 ----
  const css02370_01 = buildCSS02370_01({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    registrationActiveDate: m.cosDate,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
    registrationDate: m.registrationDate,
  });

  // ---- CSS02370_03 ----
  const css02370_03 = buildCSS02370_03({
    mpxn: m.mpan,
    supplierGeneratedReference: m.supplierGeneratedReference,
    registrationId: m.registrationRequestId,
    correlationId: m.cssCorrelationId,
    timestamp: ts,
    registrationDate: m.registrationDate,
  });

  // fileIndex = unique position in batch; xRefSeq = per-file-type sequence suffix
  // ---- D0260: MPAS → Supplier ----
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

  // ---- D0217: MPAS → Supplier ----
  const d0217 = buildD0217({
    envelope: makeEnvelope(m, 'D0217', fileIdBase, 2, '001', ...mpas, ...supp),
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

  // Shared D0011 record data (034/038) — same for MOP, DC, DA
  const d0011Common = {
    record034: { mpan: m.mpan, contractRef: m.appointmentRef, cosDate: m.cosDate },
    appointmentDate: m.cosDate,
    registerRef: m.registerCode,
  };

  // ---- D0011 MOP → Supplier (036 row) ----
  const d0011_mop = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 3, '001', ...mop, ...supp),
    appointmentType: 'MOP',
    ...d0011Common,
  });
  d0011_mop.fileName = `D0011_MOP_${m.fileDate}_001.usr`;

  // ---- D0011 DC → Supplier (035 row) ----
  const d0011_dc = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 4, '002', ...dc, ...supp),
    appointmentType: 'DC',
    ...d0011Common,
  });
  d0011_dc.fileName = `D0011_DC_${m.fileDate}_001.usr`;

  // ---- D0011 DA → Supplier (037 row) ----
  const d0011_da = buildD0011({
    envelope: makeEnvelope(m, 'D0011', fileIdBase, 5, '003', ...da, ...supp),
    appointmentType: 'DA',
    ...d0011Common,
  });
  d0011_da.fileName = `D0011_DA_${m.fileDate}_001.usr`;

  // ---- D0149: MOP → Supplier ----
  const d0149 = buildD0149({
    envelope: makeEnvelope(m, 'D0149', fileIdBase, 6, '001', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    ssc: m.ssc,
    timePatternRegiment: m.timePatternRegiment,
    msn: m.msn,
    registerId: m.registerId,
    registerMappingCoefficient: m.registerMappingCoefficient,
  });

  // ---- D0150: MOP → Supplier ----
  const d0150 = buildD0150({
    envelope: makeEnvelope(m, 'D0150', fileIdBase, 7, '001', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    energisationStatus: m.energisationStatus,
    ssc: m.ssc,
    msn: m.msn,
    meterLocation: m.meterLocation,
    manufacturersMakeAndType: [m.meterMake, m.meterModel].filter(Boolean).join(' '),
    meterAssetProviderId: m.meterAssetProviderId,
    meterType: m.d0150MeterType,
    meterInstalledDate: m.meterInstalledDate,
    certificationDate: m.certificationDate,
    retrievalMethod: m.retrievalMethod,
    retrievalMethodEffectiveDate: m.retrievalMethodEffectiveDate,
    ctRatio: m.ctPrimaryRatio,
    registerId: m.registerId,
    meterRegisterType: m.meterRegisterType,
    measurementQuantityId: m.measurementQuantityId,
    registerMappingCoefficient: m.registerMappingCoefficient,
    numberOfDigits: m.numberOfDigits,
  });

  // ---- D0052: MOP → Supplier ----
  const d0052 = buildD0052({
    envelope: makeEnvelope(m, 'D0052', fileIdBase, 8, '001', ...mop, ...supp),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      meterType: m.meterType,
      mtc: m.mtc,
      meterMake: m.meterMake,
      meterModel: m.meterModel,
      ctPrimaryRatio: m.ctPrimaryRatio,
      vtPrimaryRatio: m.vtPrimaryRatio,
      meterLocation: 'INTERNAL',
      installedDate: m.meterInstalledDate,
      outstationId: '',
    },
    record028: {
      mpan: m.mpan,
      msn: m.msn,
      registerId: m.registerId,
      measurementQuantityId: m.measurementQuantityId,
      numberOfDigits: m.numberOfDigits,
      scalingFactor: m.scalingFactor,
      timePatternRegiment: m.timePatternRegiment,
      backRegisterIndicator: STANDING_DATA_STATUS_ACTIVE,
    },
  });

  // ---- D0010: DC → Supplier ----
  const d0010 = buildD0010({
    envelope: makeEnvelope(m, 'D0010', fileIdBase, 9, '001', ...dc, ...supp),
    meterPoints: [{
      mpan: m.mpan,
      msn: m.msn,
      energisationStatus: 'E',
      registerId: m.registerId,
      readDate: m.readingDate,
      readValue: m.readingValue,
      readFlag: m.readingType,
    }],
  });

  // ---- D0086: DC → Supplier ----
  const d0086 = buildD0086({
    envelope: makeEnvelope(m, 'D0086', fileIdBase, 10, '001', ...dc, ...supp),
    record026: {
      mpan: m.mpan,
      newProfileClass: m.profileClass,
      newMeasurementClass: m.measurementClass,
      effectiveFromDate: m.registrationDate,
      reasonCode: '01',
      ssc: m.ssc,
    },
  });

  // ---- D0012: Supplier → MOP ----
  const d0012 = buildD0012({
    envelope: makeEnvelope(m, 'D0012', fileIdBase, 11, '001', ...supp, ...mop),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      requestedReadDate: m.registrationDate,
      reasonCode: '01',
      originalScheduledReadDate: '',
      registerId: m.registerId,
    },
  });

  // ---- D0019: DC → Supplier ----
  const d0019 = buildD0019({
    envelope: makeEnvelope(m, 'D0019', fileIdBase, 12, '001', ...dc, ...supp),
    records026: [
      {
        mpan: m.mpan,
        msn: m.msn,
        registerId: m.registerId,
        readDate: m.readingDate,
        validatedReading: m.readingValue,
        readingType: m.readingType,
        validationMethod: VALIDATION_METHOD_VRA,
        measurementQuantityId: m.measurementQuantityId,
      },
    ],
  });

  return {
    processId: 'cos-registration',
    processLabel: 'Electricity COS Registration',
    dflows: [
      d0260,
      d0217,
      d0011_mop,
      d0011_dc,
      d0011_da,
      d0149,
      d0150,
      d0052,
      d0010,
      d0086,
      d0012,
      d0019,
    ],
    cssMessages: [css02300, css02380, css02370_01, css02370_03],
  };
}
