// ============================================================
// Electricity Energisation — Domain Model
// ============================================================

import type { TestFlag, ProfileClass, MeasurementClass, GSPGroup } from '../../../../shared/domain/types';

export type EnergisationActionType = 'E' | 'D';

export interface ElectricityEnergisationModel {
  testFlag: TestFlag;
  fileDate: string;

  mpan: string;
  msn: string;

  supplierId: string;
  mobId: string;
  dcId: string;

  profileClass: ProfileClass;
  measurementClass: MeasurementClass;
  gspGroupId: GSPGroup;
  llfClass: string;
  ssc: string;
  distributorId: string;

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
}

export function mapFormToEnergisationModel(
  inputs: Record<string, string>
): ElectricityEnergisationModel {
  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'T',
    fileDate: inputs['fileDate'] || '',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    supplierId: inputs['supplierId'] || '',
    mobId: inputs['mobId'] || '',
    dcId: inputs['dcId'] || '',
    profileClass: (inputs['profileClass'] as ProfileClass) || '01',
    measurementClass: (inputs['measurementClass'] as MeasurementClass) || 'A',
    gspGroupId: (inputs['gspGroupId'] as GSPGroup) || '_A',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    distributorId: inputs['distributorId'] || '',
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
  };
}
