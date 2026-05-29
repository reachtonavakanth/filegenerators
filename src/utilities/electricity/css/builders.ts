// ============================================================
// CSS Message Builders — Electricity
// Construct fully typed CSS JSON message objects
// ============================================================

import type { CSSMessage } from '../../../shared/domain/types';
import type {
  CSSMessageHeader,
  CSS02380_01_Body,
  CSS02300_01_Body,
  CSS02370_01_Body,
  CSS02370_03_Body,
} from './types';

function makeHeader(
  messageType: string,
  from: string,
  to: string,
  correlationId: string,
  timestamp: string,
  testIndicator: string
): CSSMessageHeader {
  return {
    messageId: `MSG-${messageType}-${timestamp.replace(/[-:T]/g, '').slice(0, 14)}`,
    messageType,
    timestamp,
    from,
    to,
    correlationId,
    testIndicator,
    version: '01',
  };
}

// ---- CSS02300_01 ----
export function buildCSS02300_01(params: {
  mpan: string;
  currentSupplierId: string;
  newSupplierId: string;
  requestedSupplyStartDate: string;
  customerAgreementDate: string;
  timestamp: string;
  correlationId: string;
  testIndicator: string;
}): CSSMessage {
  const body: CSS02300_01_Body = {
    requestId: `REQ-${params.mpan.slice(-6)}-${params.timestamp.slice(0, 10).replace(/-/g, '')}`,
    mpan: params.mpan,
    currentSupplierId: params.currentSupplierId,
    newSupplierId: params.newSupplierId,
    requestedSupplyStartDate: params.requestedSupplyStartDate,
    customerAgreementDate: params.customerAgreementDate,
    objectType: 'DOMESTIC',
  };
  return {
    messageType: 'CSS02300_01',
    fileName: `CSS02300_01_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        'CSS02300_01',
        params.newSupplierId,
        'CSS',
        params.correlationId,
        params.timestamp,
        params.testIndicator
      ),
      body,
    },
  };
}

// ---- CSS02380_01 ----
export function buildCSS02380_01(params: {
  mpan: string;
  newSupplierId: string;
  oldSupplierId: string;
  requestedSupplyStartDate: string;
  registrationDate: string;
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  distributorId: string;
  timestamp: string;
  correlationId: string;
  testIndicator: string;
}): CSSMessage {
  const body: CSS02380_01_Body = {
    registrationId: `REG-${params.mpan.slice(-6)}-${params.registrationDate.replace(/-/g, '')}`,
    mpan: params.mpan,
    newSupplierId: params.newSupplierId,
    oldSupplierId: params.oldSupplierId,
    requestedSupplyStartDate: params.requestedSupplyStartDate,
    registrationDate: params.registrationDate,
    registrationStatus: 'ACCEPTED',
    profileClass: params.profileClass,
    measurementClass: params.measurementClass,
    gspGroupId: params.gspGroupId,
    llfClass: params.llfClass,
    ssc: params.ssc,
    distributorId: params.distributorId,
  };
  return {
    messageType: 'CSS02380_01',
    fileName: `CSS02380_01_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        'CSS02380_01',
        'CSS',
        params.newSupplierId,
        params.correlationId,
        params.timestamp,
        params.testIndicator
      ),
      body,
    },
  };
}

// ---- CSS02370_01 ----
export function buildCSS02370_01(params: {
  mpan: string;
  queryingPartyId: string;
  queryDate: string;
  timestamp: string;
  correlationId: string;
  testIndicator: string;
}): CSSMessage {
  const body: CSS02370_01_Body = {
    queryReference: `QRY-${params.mpan.slice(-6)}-${params.queryDate.replace(/-/g, '')}`,
    mpan: params.mpan,
    queryType: 'REGISTRATION_STATUS',
    queryDate: params.queryDate,
    queryingPartyId: params.queryingPartyId,
  };
  return {
    messageType: 'CSS02370_01',
    fileName: `CSS02370_01_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        'CSS02370_01',
        params.queryingPartyId,
        'CSS',
        params.correlationId,
        params.timestamp,
        params.testIndicator
      ),
      body,
    },
  };
}

// ---- CSS02370_03 ----
export function buildCSS02370_03(params: {
  mpan: string;
  queryReference: string;
  responseDate: string;
  supplierId: string;
  profileClass: string;
  measurementClass: string;
  registrationStatus: string;
  timestamp: string;
  correlationId: string;
  testIndicator: string;
}): CSSMessage {
  const body: CSS02370_03_Body = {
    queryReference: params.queryReference,
    mpan: params.mpan,
    queryType: 'REGISTRATION_STATUS',
    responseStatus: 'SUCCESS',
    responseDate: params.responseDate,
    responseData: {
      currentSupplierId: params.supplierId,
      registrationStatus: params.registrationStatus,
      profileClass: params.profileClass,
      measurementClass: params.measurementClass,
    },
  };
  return {
    messageType: 'CSS02370_03',
    fileName: `CSS02370_03_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        'CSS02370_03',
        'CSS',
        params.supplierId,
        params.correlationId,
        params.timestamp,
        params.testIndicator
      ),
      body,
    },
  };
}
