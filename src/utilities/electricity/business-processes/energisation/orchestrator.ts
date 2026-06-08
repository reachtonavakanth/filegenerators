// ============================================================
// Electricity Energisation — Process Orchestrator
// Produces D0142, D0010, D0149, D0150 + CSS JSON
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityEnergisationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';

import { buildD0142 } from '../../dflows/d0142';
import { buildD0010 } from '../../dflows/d0010';
import { buildD0149 } from '../../dflows/d0149';
import { buildD0150 } from '../../dflows/d0150';
import { buildCSS02380_01, buildCSS02370_01 } from '../../css/builders';

function makeEnvelope(
  m: ElectricityEnergisationModel,
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

export function orchestrateEnergisation(
  m: ElectricityEnergisationModel
): GeneratedOutput {
  const ts = new Date().toISOString();
  const hhmmss = currentHHMMSS();
  const correlationId = `COR-EN-${m.mpan.slice(-6)}-${m.fileDate}`;
  const fileIdBase = generateFileIdBase();
  const reg0 = m.registers[0];

  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  const env = (flowId: string, idx: number, seq: string, from: readonly [string, string], to: readonly [string, string]) =>
    makeEnvelope(m, hhmmss, flowId, fileIdBase, idx, seq, from[0], from[1], to[0], to[1]);

  // ---- D0142: Supplier → MOP ----
  const d0142 = buildD0142({
    envelope: env('D0142', 1, '001', supp, mop),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      requestedDate: m.requestedDate,
      actionRequired: m.actionRequired,
      reasonCode: m.reasonCode,
      accessDetails: m.accessDetails,
      contactName: m.contactName,
      contactNumber: m.contactNumber,
    },
  });

  // ---- D0010: DC → Supplier — one 030 per register ----
  const d0010 = buildD0010({
    envelope: env('D0010', 2, '002', dc, supp),
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

  // ---- D0149: MOP → Supplier — one 284 per register ----
  const d0149 = buildD0149({
    envelope: env('D0149', 3, '001', mop, supp),
    mpan: m.mpan,
    cosDate: m.requestedDate,
    ssc: m.ssc,
    sconDate: m.sconDate,
    timePatternRegiment: m.timePatternRegiment,
    msn: m.msn,
    registers: m.registers.map(r => ({
      registerId: r.registerId,
      registerCoefficient: r.d0149RegisterCoefficient,
    })),
  });

  // ---- D0150: MOP → Supplier — one 293 per register ----
  const d0150 = buildD0150({
    envelope: env('D0150', 4, '002', mop, supp),
    mpan: m.mpan,
    cosDate: m.requestedDate,
    energisationStatus: m.actionRequired,
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

  // ---- CSS02380_01 ----
  const css02380 = buildCSS02380_01({
    mpxn: m.mpan,
    registrationRequestId: '',
    supplierGeneratedReference: '',
    correlationId,
    timestamp: ts,
  });

  // ---- CSS02370_01 ----
  const css02370 = buildCSS02370_01({
    mpxn: m.mpan,
    supplierGeneratedReference: '',
    registrationId: '',
    registrationActiveDate: m.requestedDate,
    correlationId,
    timestamp: ts,
    registrationDate: m.requestedDate,
  });

  return {
    processId: 'energisation',
    processLabel: `Electricity ${m.actionRequired === 'E' ? 'Energisation' : 'De-energisation'}`,
    dflows: [d0142, d0010, d0149, d0150],
    cssMessages: [css02380, css02370],
  };
}
