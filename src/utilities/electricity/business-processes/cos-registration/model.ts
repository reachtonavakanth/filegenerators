// ============================================================
// Electricity COS Registration — Domain Model
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';

export interface ElectricityCOSRegistrationModel {
  // Envelope / file settings
  testFlag: TestFlag;
  fileDate: string;    // YYYYMMDD

  // ZHV routing — per party: Role Code + Participant ID (participant ID also used in D-flow body records)
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

  // D0260 758 / D0217 492 body fields
  instructionNumber: string;     // up to 10-digit integer reference (shared)
  instructionType: string;       // D0260 instruction type e.g. 'SP43'
  d0217InstructionType: string;  // D0217 instruction type e.g. 'SP40'
  energisationStatus: string;    // 'E' | 'D'
  aggrType: string;              // Data Aggregation Type: 'H' | 'N'
  collectorType: string;         // Data Collector Type:   'H' | 'N'
  mopType: string;               // Meter Operator Type:   'H' | 'N'

  // D0217 492 — postcode (field[16])
  postcode: string;

  // D0011 034/037/038 fields
  appointmentRef: string;  // e.g. 'GMTRNDA001'
  registerCode: string;    // 038 field[2]

  // Supply point
  mpan: string;        // 13-digit MPAN
  msn: string;         // Meter Serial Number

  // Technical attributes
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;    // Line Loss Factor Class
  ssc: string;         // Standard Settlement Configuration

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

export function mapFormToCOSModel(
  inputs: Record<string, string>
): ElectricityCOSRegistrationModel {
  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    oldSupplierRoleCode: inputs['oldSupplierRoleCode'] || '',
    oldSupplierParticipantId: inputs['oldSupplierParticipantId'] || '',
    distributorRoleCode: inputs['distributorRoleCode'] || '',
    distributorParticipantId: inputs['distributorParticipantId'] || '',
    mpasRoleCode: inputs['mpasRoleCode'] || '',
    mpasParticipantId: inputs['mpasParticipantId'] || '',
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
    appointmentRef: inputs['appointmentRef'] || '',
    registerCode: inputs['registerCode'] || '',
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
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    readingType: inputs['readingType'] || 'A',
    readingValue: inputs['readingValue'] || '00000',
    readingDate: inputs['readingDate'] || inputs['registrationDate'] || '',
    estimatedAnnualConsumption: inputs['estimatedAnnualConsumption'] || '3100',
  };
}
