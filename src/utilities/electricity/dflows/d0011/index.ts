// D0011 — Standing Data Amendment (three role variants: MOP / DC / DA)

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

// ---- MOP version ----
export interface D0011_MOP_058 {
  mpan: string;
  msn: string;
  meterType: string;
  mtc: string;
  meterMake: string;
  ctPrimaryRatio: string;
  vtPrimaryRatio: string;
  installedDate: string;
  removedDate: string;
}

export interface D0011_MOP_059 {
  mpan: string;
  msn: string;
  registerId: string;
  measurementQuantityId: string;
  backRegisterIndicator: string;
  timePatternRegiment: string;
  numberOfDigits: string;
}

export interface D0011_MOPModel {
  envelope: DFlowEnvelope;
  record058: D0011_MOP_058;
  record059: D0011_MOP_059;
}

export function buildD0011_MOP(model: D0011_MOPModel): DFlowFile {
  const { envelope, record058: r58, record059: r59 } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '058', fields: [r58.mpan, r58.msn, r58.meterType, r58.mtc, r58.meterMake, r58.ctPrimaryRatio, r58.vtPrimaryRatio, r58.installedDate, r58.removedDate] },
      { recordType: '059', fields: [r59.mpan, r59.msn, r59.registerId, r59.measurementQuantityId, r59.backRegisterIndicator, r59.timePatternRegiment, r59.numberOfDigits] },
    ],
  };
}

// ---- DC version ----
export interface D0011_DC_028 {
  mpan: string;
  profileClass: string;
  measurementClass: string;
  estimatedAnnualConsumption: string;
  effectiveFromDate: string;
  reasonCode: string;
}

export interface D0011_DCModel {
  envelope: DFlowEnvelope;
  record028: D0011_DC_028;
}

export function buildD0011_DC(model: D0011_DCModel): DFlowFile {
  const { envelope, record028: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '028', fields: [r.mpan, r.profileClass, r.measurementClass, r.estimatedAnnualConsumption, r.effectiveFromDate, r.reasonCode] },
    ],
  };
}

// ---- DA version ----
export interface D0011_DA_029 {
  mpan: string;
  dataAggregatorId: string;
  nominatedDistributorId: string;
  effectiveFromDate: string;
  settlementDate: string;
}

export interface D0011_DAModel {
  envelope: DFlowEnvelope;
  record029: D0011_DA_029;
}

export function buildD0011_DA(model: D0011_DAModel): DFlowFile {
  const { envelope, record029: r } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZTT',
    records: [
      { recordType: '029', fields: [r.mpan, r.dataAggregatorId, r.nominatedDistributorId, r.effectiveFromDate, r.settlementDate] },
    ],
  };
}
