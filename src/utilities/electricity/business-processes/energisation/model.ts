// ============================================================
// Electricity Energisation — Domain Model
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';

export type EnergisationActionType = 'E' | 'D';

export interface ElectricityEnergisationModel {
  testFlag: TestFlag;
  fileDate: string;

  // ZHV routing — per-party DTN codes
  supplierRoleCode: string;       // Supplier role code   e.g. 'X'
  supplierParticipantId: string;  // Supplier participant  e.g. 'GMTR'
  mopRoleCode: string;            // MOB role code        e.g. 'M'
  mopParticipantId: string;       // MOB participant      e.g. 'BMET'
  dcRoleCode: string;             // DC role code         e.g. 'D'
  dcParticipantId: string;        // DC participant       e.g. 'UDMS'

  mpan: string;
  msn: string;

  supplierId: string;
  mobId: string;
  dcId: string;

  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
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
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    mopRoleCode: inputs['mopRoleCode'] || 'M',
    mopParticipantId: inputs['mopParticipantId'] || '',
    dcRoleCode: inputs['dcRoleCode'] || 'D',
    dcParticipantId: inputs['dcParticipantId'] || '',
    mpan: inputs['mpan'] || '',
    msn: inputs['msn'] || '',
    supplierId: inputs['supplierId'] || '',
    mobId: inputs['mobId'] || '',
    dcId: inputs['dcId'] || '',
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
