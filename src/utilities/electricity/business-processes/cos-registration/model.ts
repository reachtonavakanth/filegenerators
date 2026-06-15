// ============================================================
// Electricity COS Registration — Domain Model
// ============================================================

import type { TestFlag, MeterGroupEntry } from '../../../../shared/domain/types';
export type { MeterGroupEntry };

export interface ElectricityCOSRegistrationModel {
  // Envelope / file settings
  testFlag: TestFlag;
  fileDate: string;    // YYYYMMDD

  // ZHV routing
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

  // D0260 / D0217 body fields
  instructionNumber: string;
  instructionType: string;
  d0217InstructionType: string;
  energisationStatus: string;
  aggrType: string;
  collectorType: string;
  mopType: string;
  postcode: string;

  // D0011 contract references and 038 service refs — one set per appointment type
  contractRefMop: string;
  mopServiceRef: string;
  mopServiceLevelRef: string;
  contractRefDc: string;
  dcServiceRef: string;
  dcServiceLevelRef: string;
  contractRefDa: string;
  daServiceRef: string;
  daServiceLevelRef: string;

  // Supply point
  mpan: string;

  // Technical attributes
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  sconDate: string;

  // Meter Timeswitch Code (MPAN-level, used in D0260/D0217)
  mtc: string;

  // CSS identifiers
  supplierGeneratedReference: string;
  registrationRequestId: string;
  cssCorrelationId: string;
  timestampFormat: 'utc' | 'local';

  // Dates
  registrationDate: string;
  cosDate: string;

  // D0012
  regularReadingCycle: string;

  // D0019 output mode
  d0019ConsumptionType: 'estimated' | 'actual';

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
        actualAnnualConsumption:    inputs[`actualAnnualConsumption_${i}_${j}`]    || '',
      });
      j++;
    }
    if (registers.length === 0) {
      registers.push({
        registerId: 'S', d0149RegisterCoefficient: '1', meterRegisterType: 'C',
        measurementQuantityId: 'AI', registerMappingCoefficient: '1.00', numberOfDigits: '5',
        readingDate: '', bscValidationStatus: 'V', readingType: 'I',
        readingValue: '00000.0', meterReadingFlag: 'T', readingMethod: 'N',
        estimatedAnnualConsumption: '3100', actualAnnualConsumption: '',
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
    contractRefMop:     inputs['contractRefMop']     || '',
    mopServiceRef:      inputs['mopServiceRef']      || '',
    mopServiceLevelRef: inputs['mopServiceLevelRef'] || '',
    contractRefDc:      inputs['contractRefDc']      || '',
    dcServiceRef:       inputs['dcServiceRef']       || '',
    dcServiceLevelRef:  inputs['dcServiceLevelRef']  || '',
    contractRefDa:      inputs['contractRefDa']      || '',
    daServiceRef:       inputs['daServiceRef']       || '',
    daServiceLevelRef:  inputs['daServiceLevelRef']  || '',
    mpan: inputs['mpan'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    sconDate: inputs['sconDate'] || inputs['cosDate'] || inputs['registrationDate'] || '',
    mtc: inputs['mtc'] || '001',
    supplierGeneratedReference: inputs['supplierGeneratedReference'] || '',
    registrationRequestId: inputs['registrationRequestId'] || '',
    cssCorrelationId: inputs['cssCorrelationId'] || '',
    timestampFormat: inputs['timestampFormat'] === 'local' ? 'local' : 'utc',
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    regularReadingCycle: inputs['regularReadingCycle'] || 'D',
    d0019ConsumptionType: (inputs['d0019ConsumptionType'] === 'actual' ? 'actual' : 'estimated'),
    meterGroups: extractMeterGroups(inputs),
  };
}
