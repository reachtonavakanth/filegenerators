// ============================================================
// Electricity Energisation — Domain Model
// ============================================================

import type { TestFlag } from '../../../../shared/domain/types';
import type { RegisterEntry } from '../cos-registration/model';
export type { RegisterEntry };

export type EnergisationActionType = 'E' | 'D';

export interface ElectricityEnergisationModel {
  testFlag: TestFlag;
  fileDate: string;

  // ZHV routing
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
  sconDate: string;

  meterType: string;
  mtc: string;
  manufacturersMakeAndType: string;
  ctPrimaryRatio: string;
  timePatternRegiment: string;
  meterInstalledDate: string;

  // Energisation specific
  actionRequired: EnergisationActionType;
  requestedDate: string;
  reasonCode: string;
  accessDetails: string;
  contactName: string;
  contactNumber: string;

  // D0150 standing data
  meterLocation: string;
  meterAssetProviderId: string;
  certificationDate: string;
  retrievalMethod: string;
  retrievalMethodEffectiveDate: string;

  // Per-register data
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
    sconDate: inputs['sconDate'] || inputs['requestedDate'] || '',
    meterType: inputs['meterType'] || 'S1A',
    mtc: inputs['mtc'] || '001',
    manufacturersMakeAndType: inputs['manufacturersMakeAndType'] || '',
    ctPrimaryRatio: inputs['ctPrimaryRatio'] || '1',
    timePatternRegiment: inputs['timePatternRegiment'] || '00001',
    meterInstalledDate: inputs['meterInstalledDate'] || '',
    actionRequired: (inputs['actionRequired'] as EnergisationActionType) || 'E',
    requestedDate: inputs['requestedDate'] || '',
    reasonCode: inputs['reasonCode'] || '01',
    accessDetails: inputs['accessDetails'] || '',
    contactName: inputs['contactName'] || '',
    contactNumber: inputs['contactNumber'] || '',
    meterLocation: inputs['meterLocation'] || 'J',
    meterAssetProviderId: inputs['meterAssetProviderId'] || '',
    certificationDate: inputs['certificationDate'] || '',
    retrievalMethod: inputs['retrievalMethod'] || 'R',
    retrievalMethodEffectiveDate: inputs['retrievalMethodEffectiveDate'] || '',
    registers: extractRegisters(inputs),
  };
}
