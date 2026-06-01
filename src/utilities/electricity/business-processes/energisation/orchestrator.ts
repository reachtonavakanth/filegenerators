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

export function orchestrateEnergisation(
  m: ElectricityEnergisationModel
): GeneratedOutput {
  const ts = new Date().toISOString();
  const correlationId = `COR-EN-${m.mpan.slice(-6)}-${m.fileDate}`;
  const fileIdBase = generateFileIdBase();

  const supp = [m.supplierRoleCode, m.supplierParticipantId] as const;
  const mop  = [m.mopRoleCode, m.mopParticipantId]           as const;
  const dc   = [m.dcRoleCode, m.dcParticipantId]             as const;

  // ---- D0142: Supplier → MOP ----
  const d0142 = buildD0142({
    envelope: makeEnvelope(m, 'D0142', fileIdBase, 1, '001', ...supp, ...mop),
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

  // ---- D0010: DC → Supplier ----
  const d0010 = buildD0010({
    envelope: makeEnvelope(m, 'D0010', fileIdBase, 2, '001', ...dc, ...supp),
    meterPoints: [{
      mpan: m.mpan,
      msn: m.msn,
      energisationStatus: m.actionRequired,
      registerId: m.registerId,
      readDate: m.readingDate,
      readValue: m.readingValue,
      readFlag: m.readingType,
    }],
  });

  // ---- D0149: MOP → Supplier ----
  const d0149 = buildD0149({
    envelope: makeEnvelope(m, 'D0149', fileIdBase, 3, '001', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.requestedDate,
    ssc: m.ssc,
    timePatternRegiment: m.timePatternRegiment,
    msn: m.msn,
    registerId: m.registerId,
    registerMappingCoefficient: m.registerMappingCoefficient,
  });

  // ---- D0150: MOP → Supplier ----
  const d0150 = buildD0150({
    envelope: makeEnvelope(m, 'D0150', fileIdBase, 4, '001', ...mop, ...supp),
    mpan: m.mpan,
    cosDate: m.requestedDate,
    energisationStatus: m.actionRequired,
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

  // ---- CSS02380_01: Energisation Notification ----
  const css02380 = buildCSS02380_01({
    mpxn: m.mpan,
    registrationRequestId: '',
    supplierGeneratedReference: '',
    correlationId,
    timestamp: ts,
  });
  // ---- CSS02370_01: Registration Secured Active Notification ----
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
