// HH Advanced COS Registration — Process Orchestrator

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityHHCOSRegistrationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';
import { STANDING_DATA_STATUS_ACTIVE } from '../../industry-constants';

import { buildD0260 } from '../../dflows/d0260';
import { buildD0217 } from '../../dflows/d0217';
import { buildD0011 } from '../../dflows/d0011';
import { buildD0051 } from '../../dflows/d0051';
import { buildD0268 } from '../../dflows/d0268';
import { buildD0036 } from '../../dflows/d0036';
import {
  buildCSS02300_01,
  buildCSS02380_01,
  buildCSS02370_01,
  buildCSS02370_03,
} from '../../css/builders';

function makeEnvelope(
  m: ElectricityHHCOSRegistrationModel,
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

function localISOString(): string {
  const d = new Date();
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

export function orchestrateHHCOSRegistration(
  m: ElectricityHHCOSRegistrationModel
): GeneratedOutput {
  const ts = m.timestampFormat === 'local' ? localISOString() : new Date().toISOString();
  const hhmmss = currentHHMMSS();
  const fileIdBase = generateFileIdBase();

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
      mtc: '',
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
      mtc: '',
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

  // ---- D0051: DC → Supplier ----
  const d0051 = buildD0051({
    envelope: env('D0051', 6, '001', dc, supp),
    mpan: m.mpan,
    retrievalMethod: m.retrievalMethod,
    retrievalMethodEffectiveDate: m.cosDate,
    effectiveFromSettlementDate: m.cosDate,
  });

  // ---- D0268: MOP → Supplier — 01A + 02A×N + (03A + 04A×M)×P ----
  const d0268 = buildD0268({
    envelope: env('D0268', 7, '002', mop, supp),
    mpan: m.mpan,
    cosDate: m.cosDate,
    meterCop: m.meterCop,
    meterCopIssueNumber: m.meterCopIssueNumber,
    complexSiteIndicator: m.complexSiteIndicator,
    meterEquipmentLocation: m.meterEquipmentLocation,
    systemVoltage: m.systemVoltage,
    numberOfPhases: m.numberOfPhases,
    eventIndicator: m.eventIndicator,
    additionalInformation: m.additionalInformation,
    outstations: m.outstations,
    meters: m.meters,
  });

  // ---- D0036: DC → Supplier ----
  const d0036 = buildD0036({
    envelope: env('D0036', 8, '001', dc, supp),
    mpan: m.mpan,
    measurementQuantityId: m.hhMeasurementQuantityId,
    supplierParticipantId: m.supplierParticipantId,
    settlements: m.hhSettlements,
  });

  const warnings: string[] = [];
  for (const s of m.hhSettlements) {
    const filled = s.periods.filter(p => p.consumption.trim() !== '').length;
    if (filled < 48) {
      const label = s.settlementDate || 'unknown date';
      warnings.push(`Settlement ${label}: ${filled} of 48 intervals have values (${48 - filled} missing)`);
    }
  }

  return {
    processId: 'hh-advanced-cos-registration',
    processLabel: 'Electricity HH Advanced COS Registration',
    dflows: [d0260, d0217, d0011_mop, d0011_da, d0011_dc, d0051, d0268, d0036],
    cssMessages: [css02300, css02380, css02370_01, css02370_03],
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
