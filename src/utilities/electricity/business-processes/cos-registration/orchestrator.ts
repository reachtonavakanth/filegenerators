// ============================================================
// Electricity CoS Registration — Process Orchestrator
// Produces all 16 D-flow + CSS outputs for a CoS Registration
// ============================================================

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { ElectricityCoSRegistrationModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS } from '../../../../shared/rendering/dflow-renderer';

import { buildD0260 } from '../../dflows/d0260';
import { buildD0217 } from '../../dflows/d0217';
import { buildD0011_MOP, buildD0011_DC, buildD0011_DA } from '../../dflows/d0011';
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

// recipientRole / senderRole constants per flow direction
const ROLE_SUPP = 'SUPP';
const ROLE_MOPB = 'MOPB';
const ROLE_DCOL = 'DCOL';
const ROLE_HHDA = 'HHDA';
const ROLE_CSS  = 'CSS';

function makeEnvelope(
  m: ElectricityCoSRegistrationModel,
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

export function orchestrateCoSRegistration(
  m: ElectricityCoSRegistrationModel
): GeneratedOutput {
  const t = currentHHMMSS();
  const ts = `${m.fileDate.slice(0, 4)}-${m.fileDate.slice(4, 6)}-${m.fileDate.slice(6, 8)}T${t.slice(0, 2)}:${t.slice(2, 4)}:${t.slice(4, 6)}Z`;
  const correlationId = `COR-${m.mpan.slice(-6)}-${m.fileDate}`;
  const qryRef = `QRY-${m.mpan.slice(-6)}-${m.fileDate}`;

  // ---- CSS02300_01: Supplier → CSS (CoS Initiation Request) ----
  const css02300 = buildCSS02300_01({
    mpan: m.mpan,
    currentSupplierId: m.oldSupplierId,
    newSupplierId: m.newSupplierId,
    requestedSupplyStartDate: m.registrationDate,
    customerAgreementDate: m.registrationDate,
    timestamp: ts,
    correlationId,
    testIndicator: m.testFlag,
  });

  // ---- CSS02380_01: CSS → New Supplier (Registration Accepted) ----
  const css02380 = buildCSS02380_01({
    mpan: m.mpan,
    newSupplierId: m.newSupplierId,
    oldSupplierId: m.oldSupplierId,
    requestedSupplyStartDate: m.registrationDate,
    registrationDate: m.registrationDate,
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

  // ---- CSS02370_01: Supplier → CSS (Status Query) ----
  const css02370_01 = buildCSS02370_01({
    mpan: m.mpan,
    queryingPartyId: m.newSupplierId,
    queryDate: m.registrationDate,
    timestamp: ts,
    correlationId,
    testIndicator: m.testFlag,
  });

  // ---- CSS02370_03: CSS → Supplier (Query Response) ----
  const css02370_03 = buildCSS02370_03({
    mpan: m.mpan,
    queryReference: qryRef,
    responseDate: m.registrationDate,
    supplierId: m.newSupplierId,
    profileClass: m.profileClass,
    measurementClass: m.measurementClass,
    registrationStatus: 'ACCEPTED',
    timestamp: ts,
    correlationId,
    testIndicator: m.testFlag,
  });

  // ---- D0260: New Supplier → CSS ----
  const d0260 = buildD0260({
    envelope: makeEnvelope(m, 'D0260', m.newSupplierId, ROLE_SUPP, 'CSS', ROLE_CSS, '001'),
    record758: {
      mddReference: '',
      supplierId: m.newSupplierId,
      mpan: m.mpan,
      effectiveDate: m.registrationDate,
      customerClassification: 'NATP',
      energisationStatus: 'E',
      measurementClass: m.measurementClass,
      llfClass: m.llfClass,
      profileClass: m.profileClass,
      ssc: m.ssc,
      mobId: m.mobId,
      mobStatus: 'N',
      dcId: m.dcId,
      dcStatus: 'N',
      daId: m.daId,
      daStatus: 'N',
      field18: '', field19: '', field20: '', field21: '', field22: '',
      newConnectionFlag: 'N',
    },
  });

  // ---- D0217 → MOB ----
  const d0217_mob = buildD0217({
    envelope: makeEnvelope(m, 'D0217', 'CSS', ROLE_CSS, m.mobId, ROLE_MOPB, '002'),
    record026: {
      mpan: m.mpan,
      newSupplierId: m.newSupplierId,
      registrationDate: m.registrationDate,
      oldSupplierId: m.oldSupplierId,
      cosDate: m.cosDate,
      profileClass: m.profileClass,
      measurementClass: m.measurementClass,
      gspGroupId: m.gspGroupId,
      llfClass: m.llfClass,
      ssc: m.ssc,
      distributorId: m.distributorId,
    },
  });
  d0217_mob.fileName = `D0217_MOB_${m.fileDate}_001.usr`;

  // ---- D0217 → DC ----
  const d0217_dc = buildD0217({
    envelope: makeEnvelope(m, 'D0217', 'CSS', ROLE_CSS, m.dcId, ROLE_DCOL, '003'),
    record026: {
      mpan: m.mpan,
      newSupplierId: m.newSupplierId,
      registrationDate: m.registrationDate,
      oldSupplierId: m.oldSupplierId,
      cosDate: m.cosDate,
      profileClass: m.profileClass,
      measurementClass: m.measurementClass,
      gspGroupId: m.gspGroupId,
      llfClass: m.llfClass,
      ssc: m.ssc,
      distributorId: m.distributorId,
    },
  });
  d0217_dc.fileName = `D0217_DC_${m.fileDate}_001.usr`;

  // ---- D0217 → DA ----
  const d0217_da = buildD0217({
    envelope: makeEnvelope(m, 'D0217', 'CSS', ROLE_CSS, m.daId, ROLE_HHDA, '004'),
    record026: {
      mpan: m.mpan,
      newSupplierId: m.newSupplierId,
      registrationDate: m.registrationDate,
      oldSupplierId: m.oldSupplierId,
      cosDate: m.cosDate,
      profileClass: m.profileClass,
      measurementClass: m.measurementClass,
      gspGroupId: m.gspGroupId,
      llfClass: m.llfClass,
      ssc: m.ssc,
      distributorId: m.distributorId,
    },
  });
  d0217_da.fileName = `D0217_DA_${m.fileDate}_001.usr`;

  // ---- D0011 from MOP ----
  const d0011_mop = buildD0011_MOP({
    envelope: makeEnvelope(m, 'D0011', m.mobId, ROLE_MOPB, m.newSupplierId, ROLE_SUPP, '005'),
    record058: {
      mpan: m.mpan,
      msn: m.msn,
      meterType: m.meterType,
      mtc: m.mtc,
      meterMake: m.meterMake,
      ctPrimaryRatio: m.ctPrimaryRatio,
      vtPrimaryRatio: m.vtPrimaryRatio,
      installedDate: m.meterInstalledDate,
      removedDate: '',
    },
    record059: {
      mpan: m.mpan,
      msn: m.msn,
      registerId: m.registerId,
      measurementQuantityId: m.measurementQuantityId,
      backRegisterIndicator: 'N',
      timePatternRegiment: m.timePatternRegiment,
      numberOfDigits: m.numberOfDigits,
    },
  });
  d0011_mop.fileName = `D0011_MOP_${m.fileDate}_001.usr`;

  // ---- D0011 from DC ----
  const d0011_dc = buildD0011_DC({
    envelope: makeEnvelope(m, 'D0011', m.dcId, ROLE_DCOL, m.newSupplierId, ROLE_SUPP, '006'),
    record028: {
      mpan: m.mpan,
      profileClass: m.profileClass,
      measurementClass: m.measurementClass,
      estimatedAnnualConsumption: m.estimatedAnnualConsumption,
      effectiveFromDate: m.registrationDate,
      reasonCode: '01',
    },
  });
  d0011_dc.fileName = `D0011_DC_${m.fileDate}_001.usr`;

  // ---- D0011 from DA ----
  const d0011_da = buildD0011_DA({
    envelope: makeEnvelope(m, 'D0011', m.daId, ROLE_HHDA, m.newSupplierId, ROLE_SUPP, '007'),
    record029: {
      mpan: m.mpan,
      dataAggregatorId: m.daId,
      nominatedDistributorId: m.distributorId,
      effectiveFromDate: m.registrationDate,
      settlementDate: m.cosDate,
    },
  });
  d0011_da.fileName = `D0011_DA_${m.fileDate}_001.usr`;

  // ---- D0149: Meter Readings ----
  const d0149 = buildD0149({
    envelope: makeEnvelope(m, 'D0149', m.mobId, ROLE_MOPB, m.newSupplierId, ROLE_SUPP, '008'),
    records026: [
      {
        mpan: m.mpan,
        msn: m.msn,
        registerId: m.registerId,
        readDate: m.readingDate,
        readingType: m.readingType,
        readValue: m.readingValue,
        measurementQuantityId: m.measurementQuantityId,
      },
    ],
  });

  // ---- D0150: EAC / Consumption Data ----
  const d0150 = buildD0150({
    envelope: makeEnvelope(m, 'D0150', m.dcId, ROLE_DCOL, m.newSupplierId, ROLE_SUPP, '009'),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      estimatedAnnualConsumption: m.estimatedAnnualConsumption,
      eacReadDate: m.readingDate,
      aahedc: '0',
      siteVisitRequired: 'N',
    },
  });

  // ---- D0052: Meter Technical Details ----
  const d0052 = buildD0052({
    envelope: makeEnvelope(m, 'D0052', m.mobId, ROLE_MOPB, m.newSupplierId, ROLE_SUPP, '010'),
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
      backRegisterIndicator: 'N',
    },
  });

  // ---- D0010: Full Market Domain Data ----
  const d0010 = buildD0010({
    envelope: makeEnvelope(m, 'D0010', m.dcId, ROLE_DCOL, m.newSupplierId, ROLE_SUPP, '011'),
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

  // ---- D0086: Profile Class Amendment ----
  const d0086 = buildD0086({
    envelope: makeEnvelope(m, 'D0086', m.dcId, ROLE_DCOL, m.newSupplierId, ROLE_SUPP, '012'),
    record026: {
      mpan: m.mpan,
      newProfileClass: m.profileClass,
      newMeasurementClass: m.measurementClass,
      effectiveFromDate: m.registrationDate,
      reasonCode: '01',
      ssc: m.ssc,
    },
  });

  // ---- D0012: Meter Reading Instruction ----
  const d0012 = buildD0012({
    envelope: makeEnvelope(m, 'D0012', m.newSupplierId, ROLE_SUPP, m.mobId, ROLE_MOPB, '013'),
    record026: {
      mpan: m.mpan,
      msn: m.msn,
      requestedReadDate: m.registrationDate,
      reasonCode: '01',
      originalScheduledReadDate: '',
      registerId: m.registerId,
    },
  });

  // ---- D0019: Validated Reading ----
  const d0019 = buildD0019({
    envelope: makeEnvelope(m, 'D0019', m.dcId, ROLE_DCOL, m.newSupplierId, ROLE_SUPP, '014'),
    records026: [
      {
        mpan: m.mpan,
        msn: m.msn,
        registerId: m.registerId,
        readDate: m.readingDate,
        validatedReading: m.readingValue,
        readingType: m.readingType,
        validationMethod: 'VRA',
        measurementQuantityId: m.measurementQuantityId,
      },
    ],
  });

  return {
    processId: 'cos-registration',
    processLabel: 'Electricity CoS Registration',
    dflows: [
      d0260,
      d0217_mob,
      d0217_dc,
      d0217_da,
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
