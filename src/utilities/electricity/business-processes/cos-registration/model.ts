// ============================================================
// Electricity CoS Registration — Domain Model
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';

export interface ElectricityCoSRegistrationModel {
  // Envelope / file settings
  testFlag: TestFlag;
  fileDate: string;    // YYYYMMDD

  // ZHV routing — per-party DTN codes (fromRoleCode|fromParticipantId → toRoleCode|toParticipantId)
  mpasRoleCode: string;           // MPAS/Distributor role code   e.g. 'P'  — D0260, D0217 FROM
  mpasParticipantId: string;      // MPAS participant ID           e.g. 'EMEB' — varies per MPAN
  supplierRoleCode: string;       // Supplier role code            e.g. 'X'  — TO for most D-flows
  supplierParticipantId: string;  // Supplier participant ID       e.g. 'GMTR'
  mopRoleCode: string;            // MOB role code                 e.g. 'M'  — D0011/D0149/D0052 FROM
  mopParticipantId: string;       // MOB participant ID            e.g. 'BMET'
  daRoleCode: string;             // DA role code                  e.g. 'B'  — D0011 DA FROM
  daParticipantId: string;        // DA participant ID             e.g. 'UDMS'
  dcRoleCode: string;             // DC role code                  e.g. 'D'  — D0011/D0010/D0150 FROM
  dcParticipantId: string;        // DC participant ID             e.g. 'UDMS'

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
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
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
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    mpasRoleCode: inputs['mpasRoleCode'] || 'P',
    mpasParticipantId: inputs['mpasParticipantId'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    mopRoleCode: inputs['mopRoleCode'] || 'M',
    mopParticipantId: inputs['mopParticipantId'] || '',
    daRoleCode: inputs['daRoleCode'] || 'B',
    daParticipantId: inputs['daParticipantId'] || '',
    dcRoleCode: inputs['dcRoleCode'] || 'D',
    dcParticipantId: inputs['dcParticipantId'] || '',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    newSupplierId: inputs['newSupplierId'] || '',
    oldSupplierId: inputs['oldSupplierId'] || '',
    mobId: inputs['mobId'] || '',
    dcId: inputs['dcId'] || '',
    daId: inputs['daId'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
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
