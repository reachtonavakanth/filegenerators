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

// Accepts YYYYMMDD (8) or YYYY-MM-DD (10) → YYYY-MM-DDT{time}
// Pass a timestamp (ISO string) to use its time part; omit for T00:00:00.000Z
function toIsoDateTime(dateStr: string, timestamp?: string): string {
  const time = timestamp ? timestamp.slice(11) : '00:00:00.000Z';
  if (dateStr.length === 8) {
    return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}T${time}`;
  }
  if (dateStr.length === 10) {
    return `${dateStr}T${time}`;
  }
  return dateStr;
}

// ---- Timestamp helper ----

const CSS_GAP_MS = 3 * 60_000;

function localISOString(d: Date): string {
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}.${p(d.getMilliseconds(), 3)}`;
}

/** Returns `count` ISO timestamps spaced 3 minutes apart starting from now. */
export function generateCssTimestamps(count: number, format: 'utc' | 'local' = 'utc'): string[] {
  const base = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base.getTime() + i * CSS_GAP_MS);
    return format === 'local' ? localISOString(d) : d.toISOString();
  });
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
  registrationDate: string;
}): CSSMessage {
  const event: CSS02300_01_Event = {
    eventId: crypto.randomUUID(),
    updatedProperties: [],
    data: {
      registrationStatus: 'Pending',
      registrationStatusFromDate: toIsoDateTime(params.registrationDate, params.timestamp),
      supplierGeneratedReference: params.supplierGeneratedReference,
      mpxn: params.mpxn,
      supplyStartDate: toIsoDateTime(params.supplyStartDate),
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
    fileName: `CSS02300_01-${event.eventType}.json`,
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
    fileName: `CSS02380_01-${event.eventType}.json`,
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
      registrationStatusFromDate: toIsoDateTime(params.registrationDate, params.timestamp),
      supplierGeneratedReference: params.supplierGeneratedReference,
      registrationId: params.registrationId,
      registrationActiveDate: toIsoDateTime(params.registrationActiveDate),
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
    fileName: `CSS02370_01-${event.eventType}.json`,
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
      registrationStatusFromDate: toIsoDateTime(params.registrationDate, params.timestamp),
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
    fileName: `CSS02370_03-${event.eventType}.json`,
    content: event as unknown as Record<string, unknown>,
  };
}
