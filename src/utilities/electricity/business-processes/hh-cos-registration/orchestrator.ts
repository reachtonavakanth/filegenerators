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
  generateCssTimestamps,
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

function scaleConsumption(
  periods: Array<{ indicator: string; consumption: string }>,
  factor: number
): Array<{ indicator: string; consumption: string }> {
  return periods.map(p => ({
    indicator: p.indicator,
    consumption: p.consumption.trim()
      ? (parseFloat(p.consumption) * factor).toFixed(1)
      : '',
  }));
}

function expandDateRange(startYMD: string, endYMD: string): string[] {
  if (startYMD.length !== 8 || endYMD.length !== 8) return [];
  const dates: string[] = [];
  const cur = new Date(+startYMD.slice(0, 4), +startYMD.slice(4, 6) - 1, +startYMD.slice(6, 8));
  const end = new Date(+endYMD.slice(0, 4), +endYMD.slice(4, 6) - 1, +endYMD.slice(6, 8));
  while (cur <= end) {
    const y = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, '0');
    const dy = String(cur.getDate()).padStart(2, '0');
    dates.push(`${y}${mo}${dy}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function orchestrateHHCOSRegistration(
  m: ElectricityHHCOSRegistrationModel
): GeneratedOutput {
  const [ts0, ts1, ts2, ts3] = generateCssTimestamps(4, m.timestampFormat);
  const hhmmss = currentHHMMSS();
  const fileIdBase = generateFileIdBase();

  const mpas = [m.mpasRoleCode, m.mpasParticipantId]         as const;
  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const da   = [m.daRoleCode, m.daParticipantId]             as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  const env = (flowId: string, idx: number, seq: string, from: readonly [string, string], to: readonly [string, string]) =>
    makeEnvelope(m, hhmmss, flowId, fileIdBase, idx, seq, from[0], from[1], to[0], to[1]);

  // ---- CSS messages (order: Validation → Pending → SecuredActive → Confirmed) ----
  // eventDate steps forward by 3 minutes per file: ts0 → ts1 → ts2 → ts3
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

  // ---- D0036: DC → Supplier — one file per settlement date ----
  if (m.hhStartDate > m.hhEndDate) throw new Error(`D0036: Start Date (${m.hhStartDate}) is after End Date (${m.hhEndDate})`);
  const settlementDates = expandDateRange(m.hhStartDate, m.hhEndDate);
  const d0036Files = settlementDates.map((date, i) => {
    const file = buildD0036({
      envelope: env('D0036', 8 + i, '001', dc, supp),
      mpan: m.mpan,
      supplierParticipantId: m.supplierParticipantId,
      mqidBlocks: m.hhMQIDBlocks.map(block => ({
        measurementQuantityId: block.measurementQuantityId,
        settlements: [{
          settlementDate: date,
          periods: i % 2 === 0 ? block.periods : scaleConsumption(block.periods, m.hhLowDayFactor),
        }],
      })),
    });
    file.fileName = `D0036_${date}.usr`;
    return file;
  });

  const warnings: string[] = [];
  for (const block of m.hhMQIDBlocks) {
    const filled = block.periods.filter(p => p.consumption.trim() !== '').length;
    if (filled < 48) {
      warnings.push(`${block.measurementQuantityId}: ${filled} of 48 intervals filled (${48 - filled} missing) — applied to all ${settlementDates.length} days`);
    }
  }

  return {
    processId: 'hh-advanced-cos-registration',
    processLabel: 'Electricity HH Advanced COS Registration',
    folderName: `${m.mpan}_HH Advanced COS Registration`,
    dflows: [d0260, d0217, d0011_mop, d0011_da, d0011_dc, d0051, d0268, ...d0036Files],
    cssMessages: [css02380, css02300, css02370_01, css02370_03],
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}
