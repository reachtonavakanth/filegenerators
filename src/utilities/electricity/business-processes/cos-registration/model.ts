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
  registerCode: string;    // D0011 038 Service Reference (field[1]) & Service Level Reference (field[2]) — same value, alphanumeric max 4

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
  manufacturersMakeAndType: string;
  ctPrimaryRatio: string;
  numberOfDigits: string;
  registerId: string;  // default '01'
  measurementQuantityId: string; // AI / RI / AQ
  timePatternRegiment: string;   // TPR code

  // CSS Registration identifiers (user-provided)
  supplierGeneratedReference: string; // e.g. SC000000549
  registrationRequestId: string;      // GUID — registrationRequestId in CSS02380_01
  cssCorrelationId: string;           // GUID — correlationId shared across CSS02380_01 & CSS02300_01
  timestampFormat: 'utc' | 'local';   // Controls time part of registrationStatusFromDate in CSS messages

  // Dates
  registrationDate: string;      // YYYYMMDD supply start
  cosDate: string;               // YYYYMMDD change of supplier effective date
  meterInstalledDate: string;    // YYYYMMDD

  // Readings
  readingType: string;           // A=Actual, I=Initial, F=Final, P=Periodic, C=Customer, E=Estimated, D=Deemed
  readingValue: string;
  readingDate: string;           // YYYYMMDD
  estimatedAnnualConsumption: string; // kWh

  // D0149 / D0150 standing data fields
  meterLocation: string;                 // D0150 290[4] — Meter Location code (A–Z)
  meterAssetProviderId: string;          // D0150 290[6] — MAP participant ID e.g. 'UFUN'
  certificationDate: string;             // D0150 290[19] — YYYYMMDD certification date
  retrievalMethod: string;               // D0150 290[23] — H/M/N/R/S/U
  retrievalMethodEffectiveDate: string;  // D0150 290[24] — YYYYMMDD
  meterRegisterType: string;             // D0150 293[1] — C/M/1/2/3/4
  registerMappingCoefficient: string;    // D0149 284[2] / D0150 293[3] — e.g. '1' / '1.00'

  // D0010 / D0086 fields
  bscValidationStatus: string;  // 026[1] / 196[1] — V/U/F
  meterReadingFlag: string;     // 030[5] / 198[5] — T/F
  readingMethod: string;        // 030[6] / 198[6] — N/P

  // D0012 field
  regularReadingCycle: string;  // 039[2] — A/B/D/E/H/M/N/O/Q/S/T/W/Z

  // D0149 284[1] — separate from D0150 293[3] registerMappingCoefficient
  d0149RegisterCoefficient: string; // '1' or '-1'
}

export function mapFormToCOSModel(
  inputs: Record<string, string>
): ElectricityCOSRegistrationModel {
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
