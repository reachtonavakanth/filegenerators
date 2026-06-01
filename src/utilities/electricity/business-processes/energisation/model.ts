// ============================================================
// Electricity Energisation — Domain Model
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';

export type EnergisationActionType = 'E' | 'D';

export interface ElectricityEnergisationModel {
  testFlag: TestFlag;
  fileDate: string;

  // ZHV routing — per party: Role Code + Participant ID
  supplierRoleCode: string;
  supplierParticipantId: string;
  mopRoleCode: string;
  mopParticipantId: string;
  dcRoleCode: string;
  dcParticipantId: string;
  distributorRoleCode: string;
  distributorParticipantId: string;

  mpan: string;
  msn: string;

  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;

  meterType: string;
  mtc: string;
  meterMake: string;
  meterModel: string;
  ctPrimaryRatio: string;
  vtPrimaryRatio: string;
  numberOfDigits: string;
  registerId: string;
  measurementQuantityId: string;
  timePatternRegiment: string;
  scalingFactor: string;
  meterInstalledDate: string;

  // Energisation specific
  actionRequired: EnergisationActionType;
  requestedDate: string;
  reasonCode: string;
  accessDetails: string;
  contactName: string;
  contactNumber: string;

  // Readings
  readingType: string;
  readingValue: string;
  readingDate: string;
  estimatedAnnualConsumption: string;

  // D0149 / D0150 standing data fields
  meterLocation: string;
  meterAssetProviderId: string;
  d0150MeterType: string;
  certificationDate: string;
  retrievalMethod: string;
  retrievalMethodEffectiveDate: string;
  meterRegisterType: string;
  registerMappingCoefficient: string;
  bscValidationStatus: string;
  meterReadingFlag: string;
  readingMethod: string;
}

export function mapFormToEnergisationModel(
  inputs: Record<string, string>
): ElectricityEnergisationModel {
  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    mopRoleCode: inputs['mopRoleCode'] || '',
    mopParticipantId: inputs['mopParticipantId'] || '',
    dcRoleCode: inputs['dcRoleCode'] || '',
    dcParticipantId: inputs['dcParticipantId'] || '',
    distributorRoleCode: inputs['distributorRoleCode'] || '',
    distributorParticipantId: inputs['distributorParticipantId'] || '',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    meterType: inputs['meterType'] || 'S1A',
    mtc: inputs['mtc'] || '001',
    meterMake: inputs['meterMake'] || '',
    meterModel: inputs['meterModel'] || '',
    ctPrimaryRatio: inputs['ctPrimaryRatio'] || '1',
    vtPrimaryRatio: inputs['vtPrimaryRatio'] || '1',
    numberOfDigits: inputs['numberOfDigits'] || '5',
    registerId: inputs['registerId'] || '01',
    measurementQuantityId: inputs['measurementQuantityId'] || 'AI',
    timePatternRegiment: inputs['timePatternRegiment'] || '00001',
    scalingFactor: inputs['scalingFactor'] || '1',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    actionRequired: (inputs['actionRequired'] as EnergisationActionType) || 'E',
    requestedDate: inputs['requestedDate'] || '',
    reasonCode: inputs['reasonCode'] || '01',
    accessDetails: inputs['accessDetails'] || '',
    contactName: inputs['contactName'] || '',
    contactNumber: inputs['contactNumber'] || '',
    readingType: inputs['readingType'] || 'A',
    readingValue: inputs['readingValue'] || '00000',
    readingDate: inputs['readingDate'] || inputs['requestedDate'] || '',
    estimatedAnnualConsumption: inputs['estimatedAnnualConsumption'] || '3100',
    meterLocation: inputs['meterLocation'] || 'J',
    meterAssetProviderId: inputs['meterAssetProviderId'] || '',
    d0150MeterType: inputs['d0150MeterType'] || '',
    certificationDate: inputs['certificationDate'] || '',
    retrievalMethod: inputs['retrievalMethod'] || 'R',
    retrievalMethodEffectiveDate: inputs['retrievalMethodEffectiveDate'] || '',
    meterRegisterType: inputs['meterRegisterType'] || 'C',
    registerMappingCoefficient: inputs['registerMappingCoefficient'] || '1.00',
    bscValidationStatus: inputs['bscValidationStatus'] || 'V',
    meterReadingFlag: inputs['meterReadingFlag'] || 'T',
    readingMethod: inputs['readingMethod'] || 'N',
  };
}
