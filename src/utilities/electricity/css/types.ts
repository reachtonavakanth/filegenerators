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

// CSS02380_01 — Supplier Registration Notification (CSS → New Supplier)
export interface CSS02380_01_Body {
  registrationId: string;
  mpan: string;
  newSupplierId: string;
  oldSupplierId: string;
  requestedSupplyStartDate: string;
  registrationDate: string;
  registrationStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  rejectionReasonCode?: string;
  rejectionReasonDescription?: string;
  profileClass: string;
  measurementClass: string;
  gspGroupId: string;
  llfClass: string;
  ssc: string;
  distributorId: string;
}

export interface CSS02380_01_Message {
  header: CSSMessageHeader;
  body: CSS02380_01_Body;
}

// CSS02300_01 — Change of Supplier Initiation Request (Supplier → CSS)
export interface CSS02300_01_Body {
  requestId: string;
  mpan: string;
  currentSupplierId: string;
  newSupplierId: string;
  requestedSupplyStartDate: string;
  customerAgreementDate: string;
  objectType: 'DOMESTIC' | 'NON_DOMESTIC';
}

export interface CSS02300_01_Message {
  header: CSSMessageHeader;
  body: CSS02300_01_Body;
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
