// ============================================================
// Electricity Energisation — Domain Model
// ============================================================

import type { TestFlag, MeterGroupEntry } from '../../../../shared/domain/types';
export type { MeterGroupEntry };

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

  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  sconDate: string;

  // Meter Timeswitch Code (MPAN-level)
  mtc: string;

  // Energisation specific
  actionRequired: EnergisationActionType;
  requestedDate: string;
  reasonCode: string;
  accessDetails: string;
  contactName: string;
  contactNumber: string;

  // One entry per TPR / physical meter
  meterGroups: MeterGroupEntry[];
}

function extractMeterGroups(inputs: Record<string, string>): MeterGroupEntry[] {
  const groups: MeterGroupEntry[] = [];
  let i = 0;
  while (`timePatternRegiment_${i}` in inputs) {
    const registers = [];
    let j = 0;
    while (`registerId_${i}_${j}` in inputs) {
      registers.push({
        registerId:                 inputs[`registerId_${i}_${j}`]                 || 'S',
        d0149RegisterCoefficient:   inputs[`d0149RegisterCoefficient_${i}_${j}`]   || '1',
        meterRegisterType:          inputs[`meterRegisterType_${i}_${j}`]          || 'C',
        measurementQuantityId:      inputs[`measurementQuantityId_${i}_${j}`]      || 'AI',
        registerMappingCoefficient: inputs[`registerMappingCoefficient_${i}_${j}`] || '1.00',
        numberOfDigits:             inputs[`numberOfDigits_${i}_${j}`]             || '5',
        readingDate:                inputs[`readingDate_${i}_${j}`]                || '',
        bscValidationStatus:        inputs[`bscValidationStatus_${i}_${j}`]        || 'V',
        readingType:                inputs[`readingType_${i}_${j}`]                || 'I',
        readingValue:               inputs[`readingValue_${i}_${j}`]               || '00000.0',
        meterReadingFlag:           inputs[`meterReadingFlag_${i}_${j}`]           || 'T',
        readingMethod:              inputs[`readingMethod_${i}_${j}`]              || 'N',
        estimatedAnnualConsumption: inputs[`estimatedAnnualConsumption_${i}_${j}`] || '3100',
      });
      j++;
    }
    if (registers.length === 0) {
      registers.push({
        registerId: 'S', d0149RegisterCoefficient: '1', meterRegisterType: 'C',
        measurementQuantityId: 'AI', registerMappingCoefficient: '1.00', numberOfDigits: '5',
        readingDate: '', bscValidationStatus: 'V', readingType: 'I',
        readingValue: '00000.0', meterReadingFlag: 'T', readingMethod: 'N',
        estimatedAnnualConsumption: '3100',
      });
    }
    groups.push({
      timePatternRegiment:          inputs[`timePatternRegiment_${i}`]          || '00001',
      msn:                          inputs[`msn_${i}`]                          || '',
      meterType:                    inputs[`meterType_${i}`]                    || 'S1A',
      meterInstalledDate:           inputs[`meterInstalledDate_${i}`]           || '',
      meterLocation:                inputs[`meterLocation_${i}`]                || 'J',
      manufacturersMakeAndType:     inputs[`manufacturersMakeAndType_${i}`]     || '',
      meterAssetProviderId:         inputs[`meterAssetProviderId_${i}`]         || '',
      certificationDate:            inputs[`certificationDate_${i}`]            || '',
      retrievalMethod:              inputs[`retrievalMethod_${i}`]              || 'R',
      retrievalMethodEffectiveDate: inputs[`retrievalMethodEffectiveDate_${i}`] || '',
      ctRatio:                      inputs[`ctPrimaryRatio_${i}`]               || '1',
      registers,
    });
    i++;
  }
  if (groups.length === 0) {
    groups.push({
      timePatternRegiment: '00001', msn: '', meterType: 'S1A', meterInstalledDate: '',
      meterLocation: 'J', manufacturersMakeAndType: '', meterAssetProviderId: '',
      certificationDate: '', retrievalMethod: 'R', retrievalMethodEffectiveDate: '',
      ctRatio: '1',
      registers: [{
        registerId: 'S', d0149RegisterCoefficient: '1', meterRegisterType: 'C',
        measurementQuantityId: 'AI', registerMappingCoefficient: '1.00', numberOfDigits: '5',
        readingDate: '', bscValidationStatus: 'V', readingType: 'I',
        readingValue: '00000.0', meterReadingFlag: 'T', readingMethod: 'N',
        estimatedAnnualConsumption: '3100',
      }],
    });
  }
  return groups;
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
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    sconDate: inputs['sconDate'] || inputs['requestedDate'] || '',
    mtc: inputs['mtc'] || '001',
    actionRequired: (inputs['actionRequired'] as EnergisationActionType) || 'E',
    requestedDate: inputs['requestedDate'] || '',
    reasonCode: inputs['reasonCode'] || '01',
    accessDetails: inputs['accessDetails'] || '',
    contactName: inputs['contactName'] || '',
    contactNumber: inputs['contactNumber'] || '',
    meterGroups: extractMeterGroups(inputs),
  };
}
