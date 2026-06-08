// ============================================================
// Shared Domain Types — used across Electricity and Gas
// ============================================================

export type UtilityType = 'electricity' | 'gas';
export type TestFlag = 'OPER' | 'TR06';

// ---- D-Flow envelope (ZHV header fields) ----
// Real UK format: ZHV|{fileId}|{xRef}|{fromRoleCode}|{fromParticipantId}|{toRoleCode}|{toParticipantId}|{YYYYMMDDHHMMSS}||||{testFlag}|
// ZPT/ZTT[2] also uses fileId.  757 batch header[1] also uses fileId.

export interface DFlowEnvelope {
  fileId: string;              // ZHV[2], ZPT[2], ZTT[2], 757[1] — auto-generated file identifier
  xRef: string;                // ZHV[3] — e.g. 'D0260001'
  fromRoleCode: string;        // ZHV[4] — DTN from-role code e.g. 'P'; from UI
  fromParticipantId: string;   // ZHV[5] — DTN from-participant ID e.g. 'EMEB'; from UI
  toRoleCode: string;          // ZHV[6] — DTN to-role code e.g. 'X'; from UI
  toParticipantId: string;     // ZHV[7] — DTN to-participant ID e.g. 'GMTR'; from UI
  creationDateTime: string;    // ZHV[8] — YYYYMMDDHHMMSS combined
  testFlag: string;            // ZHV[12] — 'OPER' or 'TR06'; from UI
  dataFlowId: string;          // not in ZHV; used for file naming only
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
  warnings?: string[];
}

// ---- Meter register entry — shared across NHH COS, Smart HH COS, Energisation ----

export interface RegisterEntry {
  registerId: string;
  d0149RegisterCoefficient: string;
  meterRegisterType: string;
  measurementQuantityId: string;
  registerMappingCoefficient: string;
  numberOfDigits: string;
  readingDate: string;
  bscValidationStatus: string;
  readingType: string;
  readingValue: string;
  meterReadingFlag: string;
  readingMethod: string;
  estimatedAnnualConsumption: string;
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
  type: 'text' | 'select' | 'date' | 'time' | 'number' | 'heading' | 'fill-action';
  required: boolean;
  defaultValue?: string;
  options?: FormFieldOption[];
  placeholder?: string;
  helpText?: string;
  maxLength?: number;
  pattern?: string;
  step?: string;       // for number inputs e.g. '0.1', '1'
  readOnly?: boolean;
  // fill-action fields
  fillTargets?: string[];
  fillRange?: { min: number; max: number; decimals: number };
  syncFrom?: string;  // field id to mirror; keeps in sync until user manually edits this field
}

export interface InnerRepeatableDefinition {
  id: string;
  label: string;    // section heading e.g. "Register Details (04A)"
  addLabel: string; // button text e.g. "Add Another Register (04A)"
  fields: FormFieldDefinition[];
}

export interface BlockAutoFill {
  label: string;                               // button text e.g. "Auto-fill Periods"
  fieldIds: string[];                          // data-field-id values of text inputs to fill
  range: { min: number; max: number; decimals: number };
}

export interface FormGroupDefinition {
  id: string;
  label: string;
  icon: string;
  fields: FormFieldDefinition[];
  repeatable?: boolean;
  blockLabel?: string;             // label for each outer block e.g. "Meter", "Outstation" (default "Register")
  addLabel?: string;               // "Add Another X" button text (default "Add Another Register")
  innerRepeatable?: InnerRepeatableDefinition;
  blockAutoFill?: BlockAutoFill;   // per-block auto-fill button (repeatable groups only)
  blockFieldsClass?: string;       // extra CSS class on the fields grid inside each block
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
