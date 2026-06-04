// ============================================================
// Electricity Smart HH COS Registration — Domain Model
// (mirrors NHH COS Registration — diverge here when needed)
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';
import type { RegisterEntry } from '../cos-registration/model';
export type { RegisterEntry };

export interface ElectricitySmartHHCOSRegistrationModel {
  testFlag: TestFlag;
  fileDate: string;
  supplierRoleCode: string;
  supplierParticipantId: string;
  oldSupplierRoleCode: string;
  oldSupplierParticipantId: string;
  distributorRoleCode: string;
  distributorParticipantId: string;
  mpasRoleCode: string;
  mpasParticipantId: string;
  mopRoleCode: string;
  mopParticipantId: string;
  daRoleCode: string;
  daParticipantId: string;
  dcRoleCode: string;
  dcParticipantId: string;
  instructionNumber: string;
  instructionType: string;
  d0217InstructionType: string;
  energisationStatus: string;
  aggrType: string;
  collectorType: string;
  mopType: string;
  postcode: string;
  appointmentRef: string;
  registerCode: string;
  mpan: string;
  msn: string;
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  sconDate: string;
  meterType: string;
  mtc: string;
  manufacturersMakeAndType: string;
  ctPrimaryRatio: string;
  timePatternRegiment: string;
  meterLocation: string;
  meterAssetProviderId: string;
  certificationDate: string;
  retrievalMethod: string;
  retrievalMethodEffectiveDate: string;
  meterInstalledDate: string;
  supplierGeneratedReference: string;
  registrationRequestId: string;
  cssCorrelationId: string;
  timestampFormat: 'utc' | 'local';
  registrationDate: string;
  cosDate: string;
  regularReadingCycle: string;
  registers: RegisterEntry[];
}

function extractRegisters(inputs: Record<string, string>): RegisterEntry[] {
  const registers: RegisterEntry[] = [];
  let i = 0;
  while (`registerId_${i}` in inputs) {
    registers.push({
      registerId:                 inputs[`registerId_${i}`]                 || '01',
      d0149RegisterCoefficient:   inputs[`d0149RegisterCoefficient_${i}`]   || '1',
      meterRegisterType:          inputs[`meterRegisterType_${i}`]          || 'C',
      measurementQuantityId:      inputs[`measurementQuantityId_${i}`]      || 'AI',
      registerMappingCoefficient: inputs[`registerMappingCoefficient_${i}`] || '1.00',
      numberOfDigits:             inputs[`numberOfDigits_${i}`]             || '5',
      readingDate:                inputs[`readingDate_${i}`]                || '',
      bscValidationStatus:        inputs[`bscValidationStatus_${i}`]        || 'V',
      readingType:                inputs[`readingType_${i}`]                || 'I',
      readingValue:               inputs[`readingValue_${i}`]               || '00000.0',
      meterReadingFlag:           inputs[`meterReadingFlag_${i}`]           || 'T',
      readingMethod:              inputs[`readingMethod_${i}`]              || 'N',
      estimatedAnnualConsumption: inputs[`estimatedAnnualConsumption_${i}`] || '3100',
    });
    i++;
  }
  if (registers.length === 0) {
    registers.push({
      registerId:                 inputs['registerId']                 || '01',
      d0149RegisterCoefficient:   inputs['d0149RegisterCoefficient']   || '1',
      meterRegisterType:          inputs['meterRegisterType']          || 'C',
      measurementQuantityId:      inputs['measurementQuantityId']      || 'AI',
      registerMappingCoefficient: inputs['registerMappingCoefficient'] || '1.00',
      numberOfDigits:             inputs['numberOfDigits']             || '5',
      readingDate:                inputs['readingDate']                || '',
      bscValidationStatus:        inputs['bscValidationStatus']        || 'V',
      readingType:                inputs['readingType']                || 'I',
      readingValue:               inputs['readingValue']               || '00000.0',
      meterReadingFlag:           inputs['meterReadingFlag']           || 'T',
      readingMethod:              inputs['readingMethod']              || 'N',
      estimatedAnnualConsumption: inputs['estimatedAnnualConsumption'] || '3100',
    });
  }
  return registers;
}

export function mapFormToSmartHHCOSModel(
  inputs: Record<string, string>
): ElectricitySmartHHCOSRegistrationModel {
  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    oldSupplierRoleCode: inputs['oldSupplierRoleCode'] || 'X',
    oldSupplierParticipantId: inputs['oldSupplierParticipantId'] || '',
    distributorRoleCode: inputs['distributorRoleCode'] || '',
    distributorParticipantId: inputs['distributorParticipantId'] || '',
    mpasRoleCode: inputs['distributorRoleCode'] || '',
    mpasParticipantId: inputs['distributorParticipantId'] || '',
    mopRoleCode: inputs['mopRoleCode'] || '',
    mopParticipantId: inputs['mopParticipantId'] || '',
    daRoleCode: inputs['daRoleCode'] || '',
    daParticipantId: inputs['daParticipantId'] || '',
    dcRoleCode: inputs['dcRoleCode'] || '',
    dcParticipantId: inputs['dcParticipantId'] || '',
    instructionNumber: inputs['instructionNumber'] || '',
    instructionType: inputs['instructionType'] || 'SP43',
    d0217InstructionType: inputs['d0217InstructionType'] || 'SP40',
    energisationStatus: inputs['energisationStatus'] || 'E',
    aggrType: inputs['aggrType'] || '',
    collectorType: inputs['collectorType'] || '',
    mopType: inputs['mopType'] || '',
    postcode: inputs['postcode'] || '',
    appointmentRef: '01',
    registerCode: '01',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    sconDate: inputs['sconDate'] || inputs['cosDate'] || inputs['registrationDate'] || '',
    meterType: inputs['meterType'] || 'S1A',
    mtc: inputs['mtc'] || '001',
    manufacturersMakeAndType: inputs['manufacturersMakeAndType'] || '',
    ctPrimaryRatio: inputs['ctPrimaryRatio'] || '1',
    timePatternRegiment: inputs['timePatternRegiment'] || '00001',
    meterLocation: inputs['meterLocation'] || 'J',
    meterAssetProviderId: inputs['meterAssetProviderId'] || '',
    certificationDate: inputs['certificationDate'] || '',
    retrievalMethod: inputs['retrievalMethod'] || 'R',
    retrievalMethodEffectiveDate: inputs['retrievalMethodEffectiveDate'] || '',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    supplierGeneratedReference: inputs['supplierGeneratedReference'] || '',
    registrationRequestId: inputs['registrationRequestId'] || '',
    cssCorrelationId: inputs['cssCorrelationId'] || '',
    timestampFormat: inputs['timestampFormat'] === 'local' ? 'local' : 'utc',
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    regularReadingCycle: inputs['regularReadingCycle'] || 'D',
    registers: extractRegisters(inputs),
  };
}
