// ============================================================
// Electricity CoS Registration — Domain Model
// ============================================================

import type { TestFlag, ProfileClass, MeasurementClass, GSPGroup } from '../../../../shared/domain/types';

export interface ElectricityCoSRegistrationModel {
  // Envelope / file settings
  testFlag: TestFlag;
  fileDate: string;    // YYYYMMDD

  // Supply point
  mpan: string;        // 13-digit MPAN
  msn: string;         // Meter Serial Number

  // Parties
  newSupplierId: string;
  oldSupplierId: string;
  mobId: string;       // Meter Operator
  dcId: string;        // Data Collector
  daId: string;        // Data Aggregator

  // Technical attributes
  profileClass: ProfileClass;
  measurementClass: MeasurementClass;
  gspGroupId: GSPGroup;
  llfClass: string;    // Line Loss Factor Class
  ssc: string;         // Standard Settlement Configuration
  distributorId: string;

  // Meter details
  meterType: string;   // e.g. 'S1A', 'E7A', 'H'
  mtc: string;         // Meter Timeswitch Code
  meterMake: string;
  meterModel: string;
  ctPrimaryRatio: string;
  vtPrimaryRatio: string;
  numberOfDigits: string;
  registerId: string;  // default '01'
  measurementQuantityId: string; // AI / RI / AQ
  timePatternRegiment: string;   // TPR code
  scalingFactor: string;

  // Dates
  registrationDate: string;      // YYYYMMDD supply start
  cosDate: string;               // YYYYMMDD change of supplier effective date
  meterInstalledDate: string;    // YYYYMMDD

  // Readings
  readingType: string;           // A=Actual, I=Initial, F=Final, P=Periodic, C=Customer, E=Estimated, D=Deemed
  readingValue: string;
  readingDate: string;           // YYYYMMDD
  estimatedAnnualConsumption: string; // kWh
}

export function mapFormToCoSModel(
  inputs: Record<string, string>
): ElectricityCoSRegistrationModel {
  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'T',
    fileDate: inputs['fileDate'] || '',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    newSupplierId: inputs['newSupplierId'] || '',
    oldSupplierId: inputs['oldSupplierId'] || '',
    mobId: inputs['mobId'] || '',
    dcId: inputs['dcId'] || '',
    daId: inputs['daId'] || '',
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
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    readingType: inputs['readingType'] || 'A',
    readingValue: inputs['readingValue'] || '00000',
    readingDate: inputs['readingDate'] || inputs['registrationDate'] || '',
    estimatedAnnualConsumption: inputs['estimatedAnnualConsumption'] || '3100',
  };
}
