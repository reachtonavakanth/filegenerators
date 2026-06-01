// ============================================================
// CSS Message Builders — Electricity
// Construct fully typed CSS JSON message objects
// ============================================================

import type { CSSMessage } from '../../../shared/domain/types';
import type {
  CSS02380_01_Event,
  CSS02300_01_Event,
  CSS02370_01_Event,
  CSS02370_03_Event,
} from './types';
import {
  CSS_MSG_COS_INITIATION,
  CSS_MSG_REGISTRATION_NOTIF,
  CSS_MSG_QUERY,
  CSS_MSG_QUERY_RESPONSE,
} from '../industry-constants';

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
  registrationDate: string;
}): CSSMessage {
  const event: CSS02300_01_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: {
      registrationStatus: 'Pending',
      registrationStatusFromDate: params.registrationDate.length === 10
        ? `${params.registrationDate}T00:00:00.000Z`
        : params.registrationDate,
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
  mpxn: string;
  supplierGeneratedReference: string;
  registrationId: string;
  registrationActiveDate: string;
  correlationId: string;
  timestamp: string;
  registrationDate: string;
}): CSSMessage {
  const event: CSS02370_01_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: {
      registrationStatus: 'SecuredActive',
      fuelType: 'E',
      registrationStatusFromDate: params.registrationDate.length === 10
        ? `${params.registrationDate}T00:00:00.000Z`
        : params.registrationDate,
      supplierGeneratedReference: params.supplierGeneratedReference,
      registrationId: params.registrationId,
      registrationActiveDate: params.registrationActiveDate.length === 10
        ? `${params.registrationActiveDate}T00:00:00.000Z`
        : params.registrationActiveDate,
      mpxn: params.mpxn,
    },
    eventStatus: 'Ok',
    contextType: 'GainingSupplier',
    eventDescription: 'Registration status changed to SecuredActive',
    correlationId: params.correlationId,
    eventType: 'RegistrationSecuredActiveNotification',
    version: '1.0',
    eventDate: params.timestamp,
  };
  return {
    messageType: CSS_MSG_QUERY,
    fileName: `CSS02370_01_${params.mpxn.slice(-6)}.json`,
    content: event as unknown as Record<string, unknown>,
  };
}

// ---- CSS02370_03 ----
export function buildCSS02370_03(params: {
  mpxn: string;
  supplierGeneratedReference: string;
  registrationId: string;
  correlationId: string;
  timestamp: string;
  registrationDate: string;
}): CSSMessage {
  const event: CSS02370_03_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: {
      registrationStatus: 'Confirmed',
      fuelType: 'E',
      registrationStatusFromDate: params.registrationDate.length === 10
        ? `${params.registrationDate}T00:00:00.000Z`
        : params.registrationDate,
      supplierGeneratedReference: params.supplierGeneratedReference,
      registrationId: params.registrationId,
      mpxn: params.mpxn,
    },
    eventStatus: 'Ok',
    contextType: 'GainingSupplier',
    eventDescription: 'Registration status changed to Confirmed',
    correlationId: params.correlationId,
    eventType: 'RegistrationConfirmedNotification',
    version: '1.0',
    eventDate: params.timestamp,
  };
  return {
    messageType: CSS_MSG_QUERY_RESPONSE,
    fileName: `CSS02370_03_${params.mpxn.slice(-6)}.json`,
    content: event as unknown as Record<string, unknown>,
  };
}
