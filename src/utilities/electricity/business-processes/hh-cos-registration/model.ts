// HH Advanced COS Registration — Domain Model

import type { TestFlag } from '../../../../shared/domain/types';

export interface HHMeterBlock {
  // 02A — Outstation Details
  outstationId: string;
  outstationType: string;
  modemType: string;
  outstationChannels: string;
  outstationDials: string;
  outstationPin: string;
  usernameL1: string;
  passwordL1: string;
  usernameL2: string;
  passwordL2: string;
  usernameL3: string;
  passwordL3: string;
  readerPassword: string;
  commAddressType: string;
  commMethodB: string;
  dialIndicator: string;
  commAddress: string;
  commAddressB: string;
  baudRate: string;
  commProvider: string;
  simSerial: string;
  seqMpan: string;
  seqOutstationId: string;
  // 03A — Meter Details
  msn: string;
  manufacturersMakeAndType: string;
  meterInstalledDate: string;
  meterCurrentRating: string;
  vtRatio: string;
  ctRatio: string;
  phaseWire: string;
  feederStatus: string;
  feederStatusEffectiveDate: string;
  meterAssetProviderId: string;
  // 04A — Meter Register Details
  meterRegisterId: string;
  channelNumber: string;
  pulseMultiplier: string;
  meterRegisterMultiplier: string;
  outstationMultiplier: string;
  measurementQuantityId: string;
  numberOfRegisterDigits: string;
  associatedMeterId: string;
  associatedMeterRegisterId: string;
}

export interface ElectricityHHCOSRegistrationModel {
  testFlag: TestFlag;
  fileDate: string;

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

  // D0260 / D0217
  instructionNumber: string;
  instructionType: string;
  d0217InstructionType: string;
  energisationStatus: string;
  aggrType: string;
  collectorType: string;
  mopType: string;
  postcode: string;

  // D0011
  contractRefMop: string;
  contractRefDc: string;
  contractRefDa: string;
  registerCode: string;

  // Supply point
  mpan: string;

  // Technical attributes
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;

  // Dates
  registrationDate: string;
  cosDate: string;

  // D0012
  regularReadingCycle: string;

  // CSS
  supplierGeneratedReference: string;
  registrationRequestId: string;
  cssCorrelationId: string;
  timestampFormat: 'utc' | 'local';

  // D0268 01A fields
  meterCop: string;
  meterCopIssueNumber: string;
  complexSiteIndicator: string;
  systemVoltage: string;
  numberOfPhases: string;
  eventIndicator: string;

  // Repeatable meter blocks (D0268 02A+03A+04A)
  meterBlocks: HHMeterBlock[];
}

function extractMeterBlocks(inputs: Record<string, string>): HHMeterBlock[] {
  const blocks: HHMeterBlock[] = [];
  let i = 0;
  while (`outstationId_${i}` in inputs) {
    blocks.push({
      outstationId:              inputs[`outstationId_${i}`]              || '',
      outstationType:            inputs[`outstationType_${i}`]            || 'VIS',
      modemType:                 inputs[`modemType_${i}`]                 || '',
      outstationChannels:        inputs[`outstationChannels_${i}`]        || '3',
      outstationDials:           inputs[`outstationDials_${i}`]           || '',
      outstationPin:             inputs[`outstationPin_${i}`]             || '',
      usernameL1:                inputs[`usernameL1_${i}`]                || '',
      passwordL1:                inputs[`passwordL1_${i}`]                || '',
      usernameL2:                inputs[`usernameL2_${i}`]                || '',
      passwordL2:                inputs[`passwordL2_${i}`]                || '',
      usernameL3:                inputs[`usernameL3_${i}`]                || '',
      passwordL3:                inputs[`passwordL3_${i}`]                || '',
      readerPassword:            inputs[`readerPassword_${i}`]            || '',
      commAddressType:           inputs[`commAddressType_${i}`]           || 'IP',
      commMethodB:               inputs[`commMethodB_${i}`]               || '',
      dialIndicator:             inputs[`dialIndicator_${i}`]             || '',
      commAddress:               inputs[`commAddress_${i}`]               || '',
      commAddressB:              inputs[`commAddressB_${i}`]              || '',
      baudRate:                  inputs[`baudRate_${i}`]                  || '',
      commProvider:              inputs[`commProvider_${i}`]              || '',
      simSerial:                 inputs[`simSerial_${i}`]                 || '',
      seqMpan:                   inputs[`seqMpan_${i}`]                   || '',
      seqOutstationId:           inputs[`seqOutstationId_${i}`]           || '',
      msn:                       inputs[`msn_${i}`]                       || '',
      manufacturersMakeAndType:  inputs[`manufacturersMakeAndType_${i}`]  || '',
      meterInstalledDate:        inputs[`meterInstalledDate_${i}`]        || '',
      meterCurrentRating:        inputs[`meterCurrentRating_${i}`]        || '',
      vtRatio:                   inputs[`vtRatio_${i}`]                   || '',
      ctRatio:                   inputs[`ctRatio_${i}`]                   || '',
      phaseWire:                 inputs[`phaseWire_${i}`]                 || '',
      feederStatus:              inputs[`feederStatus_${i}`]              || 'A',
      feederStatusEffectiveDate: inputs[`feederStatusEffectiveDate_${i}`] || '',
      meterAssetProviderId:      inputs[`meterAssetProviderId_${i}`]      || '',
      meterRegisterId:           inputs[`meterRegisterId_${i}`]           || '10',
      channelNumber:             inputs[`channelNumber_${i}`]             || '006',
      pulseMultiplier:           inputs[`pulseMultiplier_${i}`]           || '1.000000',
      meterRegisterMultiplier:   inputs[`meterRegisterMultiplier_${i}`]   || '1.00',
      outstationMultiplier:      inputs[`outstationMultiplier_${i}`]      || '1.0000',
      measurementQuantityId:     inputs[`measurementQuantityId_${i}`]     || '',
      numberOfRegisterDigits:    inputs[`numberOfRegisterDigits_${i}`]    || '6',
      associatedMeterId:         inputs[`associatedMeterId_${i}`]         || '',
      associatedMeterRegisterId: inputs[`associatedMeterRegisterId_${i}`] || '',
    });
    i++;
  }
  if (blocks.length === 0) {
    blocks.push({
      outstationId: inputs['outstationId'] || '', outstationType: inputs['outstationType'] || 'VIS',
      modemType: inputs['modemType'] || '', outstationChannels: inputs['outstationChannels'] || '3',
      outstationDials: inputs['outstationDials'] || '', outstationPin: inputs['outstationPin'] || '',
      usernameL1: '', passwordL1: '', usernameL2: '', passwordL2: '',
      usernameL3: '', passwordL3: '', readerPassword: '',
      commAddressType: inputs['commAddressType'] || 'IP', commMethodB: '', dialIndicator: '',
      commAddress: inputs['commAddress'] || '', commAddressB: '', baudRate: inputs['baudRate'] || '',
      commProvider: inputs['commProvider'] || '', simSerial: inputs['simSerial'] || '',
      seqMpan: '', seqOutstationId: '',
      msn: inputs['msn'] || '', manufacturersMakeAndType: inputs['manufacturersMakeAndType'] || '',
      meterInstalledDate: inputs['meterInstalledDate'] || '',
      meterCurrentRating: '', vtRatio: '', ctRatio: inputs['ctRatio'] || '',
      phaseWire: inputs['phaseWire'] || '', feederStatus: inputs['feederStatus'] || 'A',
      feederStatusEffectiveDate: inputs['feederStatusEffectiveDate'] || '',
      meterAssetProviderId: inputs['meterAssetProviderId'] || '',
      meterRegisterId: inputs['meterRegisterId'] || '10',
      channelNumber: inputs['channelNumber'] || '006',
      pulseMultiplier: inputs['pulseMultiplier'] || '1.000000',
      meterRegisterMultiplier: inputs['meterRegisterMultiplier'] || '1.00',
      outstationMultiplier: inputs['outstationMultiplier'] || '1.0000',
      measurementQuantityId: inputs['measurementQuantityId'] || '',
      numberOfRegisterDigits: inputs['numberOfRegisterDigits'] || '6',
      associatedMeterId: '', associatedMeterRegisterId: '',
    });
  }
  return blocks;
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
    contractRefMop: inputs['contractRefMop'] || '01',
    contractRefDc:  inputs['contractRefDc']  || '01',
    contractRefDa:  inputs['contractRefDa']  || '01',
    registerCode: '01',
    mpan: inputs['mpan'] || '',
    profileClass: inputs['profileClass'] || '',
    measurementClass: inputs['measurementClass'] || '',
    gspGroupId: inputs['gspGroupId'] || '',
    llfClass: inputs['llfClass'] || '001',
    ssc: inputs['ssc'] || '0000',
    registrationDate: inputs['registrationDate'] || '',
    cosDate: inputs['cosDate'] || inputs['registrationDate'] || '',
    regularReadingCycle: inputs['regularReadingCycle'] || 'D',
    supplierGeneratedReference: inputs['supplierGeneratedReference'] || '',
    registrationRequestId: inputs['registrationRequestId'] || '',
    cssCorrelationId: inputs['cssCorrelationId'] || '',
    timestampFormat: inputs['timestampFormat'] === 'local' ? 'local' : 'utc',
    meterCop: inputs['meterCop'] || '5',
    meterCopIssueNumber: inputs['meterCopIssueNumber'] || '6',
    complexSiteIndicator: inputs['complexSiteIndicator'] || 'F',
    systemVoltage: inputs['systemVoltage'] || '415',
    numberOfPhases: inputs['numberOfPhases'] || '3',
    eventIndicator: inputs['eventIndicator'] || 'J',
    meterBlocks: extractMeterBlocks(inputs),
  };
}
