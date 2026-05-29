// ============================================================
// Shared Domain Types — used across Electricity and Gas
// ============================================================

export type UtilityType = 'electricity' | 'gas';
export type TestFlag = 'OPER' | 'TR06';

// ---- D-Flow envelope (ZHV header fields) ----
// Real UK format: ZHV|{senderId}|{xRef}|{testFlag}|{recipientId}|{recipientRole}|{senderRole}|{YYYYMMDDHHMMSS}||||OPER|

export interface DFlowEnvelope {
  senderId: string;           // ZHV[2] — also repeated in 757 batch header, ZPT, ZTT
  xRef: string;               // ZHV[3] — file cross-reference e.g. 'D0260001'
  testFlag: string;           // ZHV[4] — 'P' production, 'T' test
  recipientId: string;        // ZHV[5]
  recipientRole: string;      // ZHV[6] — e.g. 'DCOL', 'MOPB', 'SUPP'
  senderRole: string;         // ZHV[7] — e.g. 'SUPP', 'DCOL'
  creationDateTime: string;   // ZHV[8] — YYYYMMDDHHMMSS combined
  dataFlowId: string;         // not in ZHV; used for file naming only
}

// ---- Typed D-flow record — one line in the .usr file ----

export interface DFlowRecord {
  recordType: string;
  fields: string[];
}

// ---- A complete D-flow file ----
// trailerType controls which trailer record is used:
//   ZPT — batch trailer (count = records in batch). D0260 uses this.
//   ZTT — file trailer  (count = all records inc. ZHV + ZTT). D0010+ use this.

export interface DFlowFile {
  envelope: DFlowEnvelope;
  fileName: string;
  records: DFlowRecord[];
  trailerType: 'ZPT' | 'ZTT';
}

// ---- CSS message (JSON output) ----

export interface CSSMessage {
  messageType: string;
  fileName: string;
  content: Record<string, unknown>;
}

// ---- Combined output from a process orchestrator ----

export interface GeneratedOutput {
  processId: string;
  processLabel: string;
  dflows: DFlowFile[];
  cssMessages: CSSMessage[];
}

// ============================================================
// UI / Form Types
// ============================================================

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface FormFieldDefinition {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'number';
  required: boolean;
  defaultValue?: string;
  options?: FormFieldOption[];
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  pattern?: string;
}

export interface FormGroupDefinition {
  id: string;
  label: string;
  icon: string;
  fields: FormFieldDefinition[];
}

export interface ProcessDefinition {
  id: string;
  label: string;
  description: string;
  utilityType: UtilityType;
  formGroups: FormGroupDefinition[];
  generate: (inputs: Record<string, string>) => GeneratedOutput;
}

export interface UtilityDefinition {
  id: UtilityType;
  label: string;
  icon: string;
  description: string;
  processes: ProcessDefinition[];
  comingSoon?: boolean;
}
