// ============================================================
// Electricity Smart HH COS Registration — Domain Model
// (mirrors NHH COS Registration — diverge here when needed)
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';

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
  meterType: string;
  mtc: string;
  manufacturersMakeAndType: string;
  ctPrimaryRatio: string;
  numberOfDigits: string;
  registerId: string;
  measurementQuantityId: string;
  timePatternRegiment: string;
  supplierGeneratedReference: string;
  registrationRequestId: string;
  cssCorrelationId: string;
  timestampFormat: 'utc' | 'local';
  registrationDate: string;
  cosDate: string;
  meterInstalledDate: string;
  readingType: string;
  readingValue: string;
  readingDate: string;
  estimatedAnnualConsumption: string;
  meterLocation: string;
  meterAssetProviderId: string;
  certificationDate: string;
  retrievalMethod: string;
  retrievalMethodEffectiveDate: string;
  meterRegisterType: string;
  registerMappingCoefficient: string;
  bscValidationStatus: string;
  meterReadingFlag: string;
  readingMethod: string;
  regularReadingCycle: string;
  d0149RegisterCoefficient: string;
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
    meterType: inputs['meterType'] || 'S1A',
    mtc: inputs['mtc'] || '001',
    manufacturersMakeAndType: inputs['manufacturersMakeAndType'] || '',
    ctPrimaryRatio: inputs['ctPrimaryRatio'] || '1',
    numberOfDigits: inputs['numberOfDigits'] || '5',
    registerId: inputs['registerId'] || '01',
    measurementQuantityId: inputs['measurementQuantityId'] || 'AI',
    timePatternRegiment: inputs['timePatternRegiment'] || '00001',
    supplierGeneratedReference: inputs['supplierGeneratedReference'] || '',
    registrationRequestId: inputs['registrationRequestId'] || '',
    cssCorrelationId: inputs['cssCorrelationId'] || '',
    timestampFormat: (inputs['timestampFormat'] === 'local' ? 'local' : 'utc'),
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    readingType: inputs['readingType'] || 'A',
    readingValue: inputs['readingValue'] || '00000',
    readingDate: inputs['readingDate'] || inputs['registrationDate'] || '',
    estimatedAnnualConsumption: inputs['estimatedAnnualConsumption'] || '3100',
    meterLocation: inputs['meterLocation'] || 'J',
    meterAssetProviderId: inputs['meterAssetProviderId'] || '',
    certificationDate: inputs['certificationDate'] || '',
    retrievalMethod: inputs['retrievalMethod'] || 'R',
    retrievalMethodEffectiveDate: inputs['retrievalMethodEffectiveDate'] || '',
    meterRegisterType: inputs['meterRegisterType'] || 'C',
    registerMappingCoefficient: inputs['registerMappingCoefficient'] || '1.00',
    bscValidationStatus: inputs['bscValidationStatus'] || 'V',
    meterReadingFlag: inputs['meterReadingFlag'] || 'T',
    readingMethod: inputs['readingMethod'] || 'N',
    regularReadingCycle: inputs['regularReadingCycle'] || 'D',
    d0149RegisterCoefficient: inputs['d0149RegisterCoefficient'] || '1',
  };
}
