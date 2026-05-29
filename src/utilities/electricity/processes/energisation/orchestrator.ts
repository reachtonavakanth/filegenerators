// ============================================================
// Electricity Energisation — Process Orchestrator
// Produces D0142, D0010, D0149, D0150 + CSS JSON
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityEnergisationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS } from '../../../../shared/rendering/dflow-renderer';
import { buildD0142 } from '../../dflows/d0142';
import { buildD0010 } from '../../dflows/d0010';
import { buildD0149 } from '../../dflows/d0149';
import { buildD0150 } from '../../dflows/d0150';
import { buildCSS02380_01, buildCSS02370_01 } from '../../css/builders';

const ROLE_SUPP = 'SUPP';
const ROLE_MOPB = 'MOPB';
const ROLE_DCOL = 'DCOL';

function makeEnvelope(
  m: ElectricityEnergisationModel,
  flowId: string,
  senderId: string,
  senderRole: string,
  recipientId: string,
  recipientRole: string,
  seq: string
): DFlowEnvelope {
  return {
    senderId,
    xRef: makeXRef(flowId, seq),
    testFlag: m.testFlag,
    recipientId,
    recipientRole,
    senderRole,
    creationDateTime: makeDateTime(m.fileDate, currentHHMMSS()),
    dataFlowId: flowId,
  };
}

export function orchestrateEnergisation(
  m: ElectricityEnergisationModel
): GeneratedOutput {
  const t = currentHHMMSS();
  const ts = `${m.fileDate.slice(0, 4)}-${m.fileDate.slice(4, 6)}-${m.fileDate.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}Z`;
  const correlationId = `COR-EN-${m.mpan.slice(-6)}-${m.fileDate}`;

  // ---- D0142: Energisation Request (Supplier → MOB) ----
  const d0142 = buildD0142({
    envelope: makeEnvelope(m, 'D0142', m.supplierId, ROLE_SUPP, m.mobId, ROLE_MOPB, '001'),
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

  // ---- D0010: Market Domain Data (DC → Supplier) ----
  const d0010 = buildD0010({
    envelope: makeEnvelope(m, 'D0010', m.dcId, ROLE_DCOL, m.supplierId, ROLE_SUPP, '002'),
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

  // ---- D0149: Meter Reading (MOB → Supplier) ----
  const d0149 = buildD0149({
    envelope: makeEnvelope(m, 'D0149', m.mobId, ROLE_MOPB, m.supplierId, ROLE_SUPP, '003'),
    records026: [{
      mpan: m.mpan,
      msn: m.msn,
      registerId: m.registerId,
      readDate: m.readingDate,
      readingType: m.readingType,
      readValue: m.readingValue,
      measurementQuantityId: m.measurementQuantityId,
    }],
  });

  // ---- D0150: EAC / Consumption Data (DC → Supplier) ----
  const d0150 = buildD0150({
    envelope: makeEnvelope(m, 'D0150', m.dcId, ROLE_DCOL, m.supplierId, ROLE_SUPP, '004'),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      estimatedAnnualConsumption: m.estimatedAnnualConsumption,
      eacReadDate: m.readingDate,
      aahedc: '0',
      siteVisitRequired: 'N',
    },
  });

  // ---- CSS02380_01: Registration/Energisation Notification ----
  const css02380 = buildCSS02380_01({
    mpan: m.mpan,
    newSupplierId: m.supplierId,
    oldSupplierId: '',
    requestedSupplyStartDate: m.requestedDate,
    registrationDate: m.requestedDate,
    profileClass: m.profileClass,
    measurementClass: m.measurementClass,
    gspGroupId: m.gspGroupId,
    llfClass: m.llfClass,
    ssc: m.ssc,
    distributorId: m.distributorId,
    timestamp: ts,
    correlationId,
    testIndicator: m.testFlag,
  });
  css02380.messageType = 'CSS02380_01_ENERGISATION';
  css02380.fileName = `CSS02380_01_EN_${m.mpan.slice(-6)}.json`;

  // ---- CSS02370_01: Status Query ----
  const css02370 = buildCSS02370_01({
    mpan: m.mpan,
    queryingPartyId: m.supplierId,
    queryDate: m.requestedDate,
    timestamp: ts,
    correlationId,
    testIndicator: m.testFlag,
  });

  return {
    processId: 'energisation',
    processLabel: `Electricity ${m.actionRequired === 'E' ? 'Energisation' : 'De-energisation'}`,
    dflows: [d0142, d0010, d0149, d0150],
    cssMessages: [css02380, css02370],
  };
}
