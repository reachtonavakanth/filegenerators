// D0052 — Provide Meter Technical Details

import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export interface D0052_026 {
  mpan: string;
  msn: string;
  meterType: string;
  mtc: string;
  meterMake: string;
  meterModel: string;
  ctPrimaryRatio: string;
  vtPrimaryRatio: string;
  meterLocation: string;
  installedDate: string;
  outstationId: string;
}

export interface D0052_028 {
  mpan: string;
  msn: string;
  registerId: string;
  measurementQuantityId: string;
  numberOfDigits: string;
  scalingFactor: string;
  timePatternRegiment: string;
  backRegisterIndicator: string;
}

export interface D0052Model {
  envelope: DFlowEnvelope;
  record026: D0052_026;
  record028: D0052_028;
}

export function buildD0052(model: D0052Model): DFlowFile {
  const { envelope, record026: r26, record028: r28 } = model;
  return {
    envelope,
    fileName: `${envelope.xRef}.usr`,
    trailerType: 'ZTT',
    records: [
      { recordType: '026', fields: [r26.mpan, r26.msn, r26.meterType, r26.mtc, r26.meterMake, r26.meterModel, r26.ctPrimaryRatio, r26.vtPrimaryRatio, r26.meterLocation, r26.installedDate, r26.outstationId] },
      { recordType: '028', fields: [r28.mpan, r28.msn, r28.registerId, r28.measurementQuantityId, r28.numberOfDigits, r28.scalingFactor, r28.timePatternRegiment, r28.backRegisterIndicator] },
    ],
  };
}
