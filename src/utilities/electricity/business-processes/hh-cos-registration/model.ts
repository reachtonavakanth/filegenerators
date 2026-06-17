// HH Advanced COS Registration — Domain Model

import type { TestFlag } from '../../../../shared/domain/types';
import type { D0268Outstation, D0268Meter, D0268MeterRegister } from '../../dflows/d0268';

export interface ElectricityHHCOSRegistrationModel {
  testFlag: TestFlag;
  fileDate: string;

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

  instructionNumber: string;
  instructionType: string;
  d0217InstructionType: string;
  energisationStatus: string;
  aggrType: string;
  collectorType: string;
  mopType: string;
  postcode: string;

  contractRefMop: string;
  mopServiceRef: string;
  mopServiceLevelRef: string;
  contractRefDa: string;
  daServiceRef: string;
  daServiceLevelRef: string;
  contractRefDc: string;
  dcServiceRef: string;
  dcServiceLevelRef: string;

  mpan: string;

  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;

  registrationDate: string;
  cosDate: string;

  supplierGeneratedReference: string;
  registrationRequestId: string;
  cssCorrelationId: string;
  timestampFormat: 'utc' | 'local';

  // D0051 120[2]
  retrievalMethod: string;

  // D0268 01A
  meterCop: string;
  meterCopIssueNumber: string;
  complexSiteIndicator: string;
  meterEquipmentLocation: string;
  systemVoltage: string;
  numberOfPhases: string;
  eventIndicator: string;
  additionalInformation: string;

  // D0268 02A — independent outstations
  outstations: D0268Outstation[];

  // D0268 03A + 04A — meters each with their own registers
  meters: D0268Meter[];

  // D0036 — HH Consumption date range + per-MQID 48 intervals
  hhStartDate: string;
  hhEndDate: string;
  hhMQIDBlocks: Array<{
    measurementQuantityId: string;
    periods: Array<{ indicator: string; consumption: string }>;
  }>;
}

function extractOutstations(inputs: Record<string, string>): D0268Outstation[] {
  const outstations: D0268Outstation[] = [];
  let i = 0;
  while (`outstationId_${i}` in inputs) {
    outstations.push({
      outstationId:       inputs[`outstationId_${i}`]       || '',
      outstationType:     inputs[`outstationType_${i}`]     || 'VIS',
      modemType:          inputs[`modemType_${i}`]          || '',
      outstationChannels: inputs[`outstationChannels_${i}`] || '3',
      outstationDials:    inputs[`outstationDials_${i}`]    || '',
      outstationPin:      inputs[`outstationPin_${i}`]      || '',
      usernameL1:         inputs[`usernameL1_${i}`]         || '',
      passwordL1:         inputs[`passwordL1_${i}`]         || '',
      usernameL2:         inputs[`usernameL2_${i}`]         || '',
      passwordL2:         inputs[`passwordL2_${i}`]         || '',
      usernameL3:         inputs[`usernameL3_${i}`]         || '',
      passwordL3:         inputs[`passwordL3_${i}`]         || '',
      readerPassword:     inputs[`readerPassword_${i}`]     || '',
      commAddressType:    inputs[`commAddressType_${i}`]    || 'IP',
      commMethodB:        inputs[`commMethodB_${i}`]        || '',
      dialIndicator:      inputs[`dialIndicator_${i}`]      || '',
      commAddress:        inputs[`commAddress_${i}`]        || '',
      commAddressB:       inputs[`commAddressB_${i}`]       || '',
      baudRate:           inputs[`baudRate_${i}`]           || '',
      commProvider:       inputs[`commProvider_${i}`]       || '',
      simSerial:          inputs[`simSerial_${i}`]          || '',
      seqMpan:            inputs[`seqMpan_${i}`]            || '',
      seqOutstationId:    inputs[`seqOutstationId_${i}`]    || '',
    });
    i++;
  }
  if (outstations.length === 0) {
    outstations.push({
      outstationId: inputs['outstationId'] || '', outstationType: inputs['outstationType'] || 'VIS',
      modemType: '', outstationChannels: inputs['outstationChannels'] || '3',
      outstationDials: inputs['outstationDials'] || '', outstationPin: '',
      usernameL1: '', passwordL1: '', usernameL2: '', passwordL2: '',
      usernameL3: '', passwordL3: '', readerPassword: '',
      commAddressType: inputs['commAddressType'] || 'IP', commMethodB: '', dialIndicator: '',
      commAddress: inputs['commAddress'] || '', commAddressB: '',
      baudRate: inputs['baudRate'] || '', commProvider: '', simSerial: '', seqMpan: '', seqOutstationId: '',
    });
  }
  return outstations;
}

function extractRegisters(inputs: Record<string, string>, meterIndex: number): D0268MeterRegister[] {
  const registers: D0268MeterRegister[] = [];
  let j = 0;
  while (`meterRegisterId_${meterIndex}_${j}` in inputs) {
    registers.push({
      meterRegisterId:           inputs[`meterRegisterId_${meterIndex}_${j}`]           || '10',
      outstationId:              inputs[`reg_outstationId_${meterIndex}_${j}`]          || '',
      channelNumber:             inputs[`channelNumber_${meterIndex}_${j}`]             || '006',
      pulseMultiplier:           inputs[`pulseMultiplier_${meterIndex}_${j}`]           || '1.000000',
      meterRegisterMultiplier:   inputs[`meterRegisterMultiplier_${meterIndex}_${j}`]   || '1.00',
      outstationMultiplier:      inputs[`outstationMultiplier_${meterIndex}_${j}`]      || '1.0000',
      measurementQuantityId:     inputs[`measurementQuantityId_${meterIndex}_${j}`]     || '',
      numberOfRegisterDigits:    inputs[`numberOfRegisterDigits_${meterIndex}_${j}`]    || '6',
      associatedMeterId:         inputs[`associatedMeterId_${meterIndex}_${j}`]         || '',
      associatedMeterRegisterId: inputs[`associatedMeterRegisterId_${meterIndex}_${j}`] || '',
    });
    j++;
  }
  if (registers.length === 0) {
    registers.push({
      meterRegisterId: '10', outstationId: '', channelNumber: '006',
      pulseMultiplier: '1.000000', meterRegisterMultiplier: '1.00', outstationMultiplier: '1.0000',
      measurementQuantityId: '', numberOfRegisterDigits: '6', associatedMeterId: '', associatedMeterRegisterId: '',
    });
  }
  return registers;
}

function extractMeters(inputs: Record<string, string>): D0268Meter[] {
  const meters: D0268Meter[] = [];
  let i = 0;
  while (`msn_${i}` in inputs) {
    meters.push({
      msn:                      inputs[`msn_${i}`]                      || '',
      manufacturersMakeAndType: inputs[`manufacturersMakeAndType_${i}`] || '',
      meterInstalledDate:       inputs[`meterInstalledDate_${i}`]       || '',
      meterCurrentRating:       inputs[`meterCurrentRating_${i}`]       || '',
      vtRatio:                  inputs[`vtRatio_${i}`]                  || '',
      ctRatio:                  inputs[`ctRatio_${i}`]                  || '',
      phaseWire:                inputs[`phaseWire_${i}`]                || '',
      feederStatus:             inputs[`feederStatus_${i}`]             || 'A',
      feederStatusEffectiveDate: inputs[`feederStatusEffectiveDate_${i}`] || '',
      meterAssetProviderId:     inputs[`meterAssetProviderId_${i}`]     || '',
      registers: extractRegisters(inputs, i),
    });
    i++;
  }
  if (meters.length === 0) {
    meters.push({
      msn: '', manufacturersMakeAndType: '', meterInstalledDate: '',
      meterCurrentRating: '', vtRatio: '', ctRatio: '', phaseWire: '',
      feederStatus: 'A', feederStatusEffectiveDate: '', meterAssetProviderId: '',
      registers: [{ meterRegisterId: '10', outstationId: '', channelNumber: '006', pulseMultiplier: '1.000000', meterRegisterMultiplier: '1.00', outstationMultiplier: '1.0000', measurementQuantityId: '', numberOfRegisterDigits: '6', associatedMeterId: '', associatedMeterRegisterId: '' }],
    });
  }
  return meters;
}

export function mapFormToHHCOSModel(
  inputs: Record<string, string>
): ElectricityHHCOSRegistrationModel {
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
    contractRefDa:      inputs['contractRefDa']      || '',
    daServiceRef:       inputs['daServiceRef']       || '',
    daServiceLevelRef:  inputs['daServiceLevelRef']  || '',
    contractRefDc:      inputs['contractRefDc']      || '',
    dcServiceRef:       inputs['dcServiceRef']       || '',
    dcServiceLevelRef:  inputs['dcServiceLevelRef']  || '',
    mpan: inputs['mpan'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '',
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    supplierGeneratedReference: inputs['supplierGeneratedReference'] || '',
    registrationRequestId: inputs['registrationRequestId'] || '',
    cssCorrelationId: inputs['cssCorrelationId'] || '',
    timestampFormat: inputs['timestampFormat'] === 'local' ? 'local' : 'utc',
    retrievalMethod: inputs['retrievalMethod'] || 'M',
    meterCop: inputs['meterCop'] || '5',
    meterCopIssueNumber: inputs['meterCopIssueNumber'] || '6',
    complexSiteIndicator: inputs['complexSiteIndicator'] || 'F',
    meterEquipmentLocation: inputs['meterEquipmentLocation'] || '',
    systemVoltage: inputs['systemVoltage'] || '415',
    numberOfPhases: inputs['numberOfPhases'] || '3',
    eventIndicator: inputs['eventIndicator'] || 'J',
    additionalInformation: inputs['additionalInformation'] || '',
    outstations: extractOutstations(inputs),
    meters: extractMeters(inputs),
    hhStartDate: inputs['hhStartDate'] || '',
    hhEndDate: inputs['hhEndDate'] || '',
    hhMQIDBlocks: extractMQIDBlocks(inputs),
  };
}

function extractMQIDBlocks(inputs: Record<string, string>) {
  const blocks = [];
  let i = 0;
  while (`hhMeasurementQuantityId_${i}` in inputs) {
    const periods = [];
    for (let p = 1; p <= 48; p++) {
      const idx = String(p).padStart(2, '0');
      periods.push({
        indicator:   inputs[`p${idx}Ind_${i}`] || 'A',
        consumption: inputs[`p${idx}Val_${i}`] ?? '',
      });
    }
    blocks.push({
      measurementQuantityId: inputs[`hhMeasurementQuantityId_${i}`] || 'AI',
      periods,
    });
    i++;
  }
  if (blocks.length === 0) {
    blocks.push({
      measurementQuantityId: 'AI',
      periods: Array.from({ length: 48 }, () => ({ indicator: 'A', consumption: '' })),
    });
  }
  return blocks;
}
