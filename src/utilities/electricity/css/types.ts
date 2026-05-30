// ============================================================
// CSS (Central Switching Service) Message Types — Electricity
// JSON-based messages exchanged with CSS for registration flows
// ============================================================

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

// CSS02370_01 — Registration Secured Active Notification (CSS → GainingSupplier)
export interface CSS02370_01_Data {
  registrationStatus: 'SecuredActive';
  fuelType: string;
  registrationStatusFromDate: string;
  supplierGeneratedReference: string;
  registrationId: string;
  registrationActiveDate: string;
  mpxn: string;
}

export interface CSS02370_01_Event {
  eventId: string;
  updatedProperties: string[];
  data: CSS02370_01_Data;
  eventStatus: 'Ok' | 'Error';
  contextType: 'GainingSupplier';
  eventDescription: string;
  correlationId: string;
  eventType: 'RegistrationSecuredActiveNotification';
  version: string;
  eventDate: string;
}

// CSS02370_03 — Registration Confirmed Notification (CSS → GainingSupplier)
export interface CSS02370_03_Data {
  registrationStatus: 'Confirmed';
  fuelType: string;
  registrationStatusFromDate: string;
  supplierGeneratedReference: string;
  registrationId: string;
  mpxn: string;
}

export interface CSS02370_03_Event {
  eventId: string;
  updatedProperties: string[];
  data: CSS02370_03_Data;
  eventStatus: 'Ok' | 'Error';
  contextType: 'GainingSupplier';
  eventDescription: string;
  correlationId: string;
  eventType: 'RegistrationConfirmedNotification';
  version: string;
  eventDate: string;
}
