// ============================================================
// CSS Message Builders — Electricity
// Construct fully typed CSS JSON message objects
// ============================================================

import type { CSSMessage } from '../../../shared/domain/types';
import type {
  CSSMessageHeader,
  CSS02380_01_Event,
  CSS02300_01_Event,
  CSS02370_01_Body,
  CSS02370_03_Body,
} from './types';
import {
  CSS_MSG_COS_INITIATION,
  CSS_MSG_REGISTRATION_NOTIF,
  CSS_MSG_QUERY,
  CSS_MSG_QUERY_RESPONSE,
} from '../industry-constants';

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
  mpxn: string;
  supplierGeneratedReference: string;
  supplyStartDate: string;
  registrationId: string;
  supplierRole: string;
  supplierMpid: string;
  correlationId: string;
  timestamp: string;
}): CSSMessage {
  const event: CSS02300_01_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: {
      registrationStatus: 'Pending',
      registrationStatusFromDate: params.timestamp,
      supplierGeneratedReference: params.supplierGeneratedReference,
      mpxn: params.mpxn,
      supplyStartDate: params.supplyStartDate.length === 10
        ? `${params.supplyStartDate}T00:00:00.000Z`
        : params.supplyStartDate,
      erroneousSwitchResolutionInd: false,
      changeOfOccupancyInd: false,
      domesticPremisesInd: false,
      fuelType: 'E',
      registrationId: params.registrationId,
      registrationInitiator: 'GainingSupplier',
      supplierRole: params.supplierRole,
      supplierMpid: params.supplierMpid,
    },
    eventStatus: 'Ok',
    contextType: 'GainingSupplier',
    eventDescription: 'Registration status changed to Pending',
    correlationId: params.correlationId,
    eventType: 'RegistrationPendingNotification',
    version: '1.0',
    eventDate: params.timestamp,
  };
  return {
    messageType: CSS_MSG_COS_INITIATION,
    fileName: `CSS02300_01_${params.mpxn.slice(-6)}.json`,
    content: event as unknown as Record<string, unknown>,
  };
}

// ---- CSS02380_01 ----
export function buildCSS02380_01(params: {
  mpxn: string;
  registrationRequestId: string;
  supplierGeneratedReference: string;
  correlationId: string;
  timestamp: string;
}): CSSMessage {
  const event: CSS02380_01_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: [
      {
        registrationRequestStatus: 'Validated',
        registrationRequestId: params.registrationRequestId,
        supplierGeneratedReference: params.supplierGeneratedReference,
        mpxn: params.mpxn,
      },
    ],
    eventStatus: 'Ok',
    contextType: 'GainingSupplier',
    eventDescription: 'Validated',
    correlationId: params.correlationId,
    eventType: 'RegistrationValidationNotification',
    version: '1.0',
    eventDate: params.timestamp,
  };
  return {
    messageType: CSS_MSG_REGISTRATION_NOTIF,
    fileName: `CSS02380_01_${params.mpxn.slice(-6)}.json`,
    content: event as unknown as Record<string, unknown>,
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
    messageType: CSS_MSG_QUERY,
    fileName: `CSS02370_01_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        CSS_MSG_QUERY,
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
    messageType: CSS_MSG_QUERY_RESPONSE,
    fileName: `CSS02370_03_${params.mpan.slice(-6)}.json`,
    content: {
      header: makeHeader(
        CSS_MSG_QUERY_RESPONSE,
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
