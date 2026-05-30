// ============================================================
// CSS (Central Switching Service) Message Types — Electricity
// JSON-based messages exchanged with CSS for registration flows
// ============================================================

export interface CSSMessageHeader {
  messageId: string;
  messageType: string;
  timestamp: string;        // ISO 8601
  from: string;             // sending party Id
  to: string;               // receiving party Id
  correlationId: string;    // links request ↔ response
  testIndicator: string;    // 'T' | 'P'
  version: string;          // message schema version e.g. '01'
}

// CSS02380_01 — Registration Validation Notification (CSS → GainingSupplier)
export interface CSS02380_01_DataItem {
  registrationRequestStatus: 'Validated' | 'Rejected' | 'Pending';
  registrationRequestId: string;
  supplierGeneratedReference: string;
  mpxn: string;
}

export interface CSS02380_01_Event {
  eventId: string;
  updatedProperties: string[];
  data: CSS02380_01_DataItem[];
  eventStatus: 'Ok' | 'Error';
  contextType: 'GainingSupplier';
  eventDescription: string;
  correlationId: string;
  eventType: 'RegistrationValidationNotification';
  version: string;
  eventDate: string;
}

// CSS02300_01 — Registration Pending Notification (CSS → GainingSupplier)
export interface CSS02300_01_Data {
  registrationStatus: 'Pending' | 'Accepted' | 'Rejected';
  registrationStatusFromDate: string;
  supplierGeneratedReference: string;
  mpxn: string;
  supplyStartDate: string;
  erroneousSwitchResolutionInd: boolean;
  changeOfOccupancyInd: boolean;
  domesticPremisesInd: boolean;
  fuelType: string;
  registrationId: string;
  registrationInitiator: 'GainingSupplier';
  supplierRole: string;
  supplierMpid: string;
}

export interface CSS02300_01_Event {
  eventId: string;
  updatedProperties: string[];
  data: CSS02300_01_Data;
  eventStatus: 'Ok' | 'Error';
  contextType: 'GainingSupplier';
  eventDescription: string;
  correlationId: string;
  eventType: 'RegistrationPendingNotification';
  version: string;
  eventDate: string;
}

// CSS02370_01 — CSS Query (Supplier → CSS)
export interface CSS02370_01_Body {
  queryReference: string;
  mpan: string;
  queryType: 'REGISTRATION_STATUS' | 'STANDING_DATA' | 'OBJECTION_STATUS';
  queryDate: string;
  queryingPartyId: string;
}

export interface CSS02370_01_Message {
  header: CSSMessageHeader;
  body: CSS02370_01_Body;
}

// CSS02370_03 — CSS Query Response (CSS → Supplier)
export interface CSS02370_03_Body {
  queryReference: string;
  mpan: string;
  queryType: string;
  responseStatus: 'SUCCESS' | 'NO_DATA' | 'ERROR';
  responseDate: string;
  responseData: Record<string, string>;
}

export interface CSS02370_03_Message {
  header: CSSMessageHeader;
  body: CSS02370_03_Body;
}
