// ============================================================
// UK Electricity Market Industry Constants
// Single source of truth for all market codes, role codes,
// option lists and field values. Update here when codes change.
// ============================================================

import type { FormFieldOption } from '../../shared/domain/types';

export const PROFILE_CLASS_OPTIONS: FormFieldOption[] = [
  { label: '01 — Domestic Unrestricted', value: '01' },
  { label: '02 — Domestic Economy 7', value: '02' },
  { label: '03 — Non-Dom Unrestricted', value: '03' },
  { label: '04 — Non-Dom Economy 7', value: '04' },
  { label: '05 — Non-Dom MD LV', value: '05' },
  { label: '06 — Non-Dom MD HV', value: '06' },
  { label: '07 — Non-Dom MD LV Sub', value: '07' },
  { label: '08 — Non-Dom MD HV Sub', value: '08' },
];

export const MEASUREMENT_CLASS_OPTIONS: FormFieldOption[] = [
  { label: 'A — Non Half-Hourly', value: 'A' },
  { label: 'B — Unrestricted Unmetered', value: 'B' },
  { label: 'C — Restricted Unmetered', value: 'C' },
  { label: 'D — Automatically read NHH', value: 'D' },
  { label: 'E — Half-Hourly', value: 'E' },
  { label: 'G — Deemed NHH', value: 'G' },
  { label: 'I — Half-Hourly AMR', value: 'I' },
];

export const GSP_GROUP_OPTIONS: FormFieldOption[] = [
  { label: '_A — Eastern', value: '_A' },
  { label: '_B — East Midlands', value: '_B' },
  { label: '_C — London', value: '_C' },
  { label: '_D — Merseyside & N Wales', value: '_D' },
  { label: '_E — Midlands', value: '_E' },
  { label: '_F — Northern', value: '_F' },
  { label: '_G — North Western', value: '_G' },
  { label: '_H — Southern', value: '_H' },
  { label: '_J — South Eastern', value: '_J' },
  { label: '_K — South Western', value: '_K' },
  { label: '_L — Yorkshire', value: '_L' },
  { label: '_M — South Scotland', value: '_M' },
  { label: '_N — North Scotland', value: '_N' },
  { label: '_P — South Wales', value: '_P' },
];

export const METER_TYPE_OPTIONS: FormFieldOption[] = [
  { label: 'S1A — Single Phase Credit', value: 'S1A' },
  { label: 'S1B — Single Phase Prepayment', value: 'S1B' },
  { label: 'S2A — Two Phase Credit', value: 'S2A' },
  { label: 'S2B — Two Phase Prepayment', value: 'S2B' },
  { label: 'E7A — Economy 7 Credit', value: 'E7A' },
  { label: 'E7B — Economy 7 Prepayment', value: 'E7B' },
  { label: 'H — Half-Hourly', value: 'H' },
  { label: 'N — Non-Domestic', value: 'N' },
  { label: 'U — Unmetered', value: 'U' },
  { label: 'NSS — Non Standard', value: 'NSS' },
];

export const NUMBER_OF_DIGITS_OPTIONS: FormFieldOption[] = [
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

export const MEASUREMENT_QUANTITY_OPTIONS: FormFieldOption[] = [
  { label: 'AI — Active Import', value: 'AI' },
  { label: 'AE — Active Export', value: 'AE' },
  { label: 'RI — Reactive Import', value: 'RI' },
  { label: 'RE — Reactive Export', value: 'RE' },
  { label: 'UN — Unassigned', value: 'UN' },
];

export const READING_TYPE_OPTIONS: FormFieldOption[] = [
  { label: 'A — Actual (physical read)', value: 'A' },
  { label: 'I — Initial (start of supply)', value: 'I' },
  { label: 'F — Final (end of supply)', value: 'F' },
  { label: 'P — Periodic (routine scheduled)', value: 'P' },
  { label: 'C — Customer self-read', value: 'C' },
  { label: 'E — Estimated', value: 'E' },
  { label: 'D — Deemed', value: 'D' },
];

export const TEST_FLAG_OPTIONS: FormFieldOption[] = [
  { label: 'OPER — Operational', value: 'OPER' },
  { label: 'TR06 — Training', value: 'TR06' },
];

export const ENERGISATION_STATUS_OPTIONS: FormFieldOption[] = [
  { label: 'E — Energised', value: 'E' },
  { label: 'D — De-energised', value: 'D' },
];

export const ENERGISATION_ACTION_OPTIONS: FormFieldOption[] = [
  { label: 'E — Energise', value: 'E' },
  { label: 'D — De-energise', value: 'D' },
];

export const ENERGISATION_REASON_OPTIONS: FormFieldOption[] = [
  { label: '01 — New Supply', value: '01' },
  { label: '02 — COS', value: '02' },
  { label: '03 — Re-energisation', value: '03' },
  { label: '04 — Prepayment Reinstatement', value: '04' },
  { label: '05 — Safety', value: '05' },
  { label: '06 — Theft', value: '06' },
];

// ---- 758 / 492 Instruction Type (common to D0260 and D0217) ----
export const INSTRUCTION_TYPE_OPTIONS: FormFieldOption[] = [
  { label: 'SP43 — D0260 Metering Point and Appointment Details of Old Suppliers Registration', value: 'SP43' },
  { label: 'SP40 — D0217 Confirmation of Change of Supplier Registration', value: 'SP40' },
  { label: 'SP20 — D0217 Confirmation of New Connection Registration', value: 'SP20' },
  { label: 'SP02 — D0205 MP and Appointment Detail Changes (Made by Supplier)', value: 'SP02' },
  { label: 'SP24 — D0213 Metering Point Detail Changes made by Supplier', value: 'SP24' },
  { label: 'SP26 — D0171 Metering Point Disconnection (cancel pending registration)', value: 'SP26' },
  { label: 'SP27 — D0171 Metering Point Disconnection (terminate registration)', value: 'SP27' },
  { label: 'SP28 — D0171 MP Detail Changes by Distribution Business (to subsequent Supplier)', value: 'SP28' },
  { label: 'SP29 — D0171 MP Detail Changes by Distribution Business (to Supplier)', value: 'SP29' },
  { label: 'SP30 — D0203 Rejection of Metering Point and Appointment Data Changes', value: 'SP30' },
  { label: 'SP51 — D0089 Metering Point changes (between gaining liability and objection)', value: 'SP51' },
  { label: 'SP64 — D0089 Metering Point changes during time of objection', value: 'SP64' },
  { label: 'SP84 — D0204 Refresh Data', value: 'SP84' },
  { label: 'SP90 — D0172 File Summary', value: 'SP90' },
  { label: 'NH01 — D0209 NHH Data Aggregator Appointment Details or Selective Refresh', value: 'NH01' },
  { label: 'NH02 — D0209 NHH Data Collector Appointment Details', value: 'NH02' },
  { label: 'NH03 — D0209 NHH Profile Class/SSC in Registration Details', value: 'NH03' },
  { label: 'NH04 — D0209 NHH Measurement Class in Registration Details', value: 'NH04' },
  { label: 'NH05 — D0209 NHH Energisation Status in Registration Details', value: 'NH05' },
  { label: 'NH06 — D0209 NHH GSP Group Details', value: 'NH06' },
  { label: 'NH07 — D0209 NHH Line Loss Factor Class Details', value: 'NH07' },
  { label: 'NH08 — D0209 NHH Full MPAS Refresh to NHHDA', value: 'NH08' },
  { label: 'NH09 — D0019 NHH EAC/AA & MS Details', value: 'NH09' },
  { label: 'HH01 — D0209 HH Data Aggregator Appointment Details or Selective Refresh', value: 'HH01' },
  { label: 'HH02 — D0209 HH Data Collector Appointment Details', value: 'HH02' },
  { label: 'HH04 — D0209 HH Measurement Class in Registration Details', value: 'HH04' },
  { label: 'HH05 — D0209 HH Energisation Status in Registration Details', value: 'HH05' },
  { label: 'HH06 — D0209 HH GSP Group Details', value: 'HH06' },
  { label: 'HH07 — D0209 HH Line Loss Factor Class Details', value: 'HH07' },
  { label: 'HH08 — D0209 HH Full MPAS Refresh to HHDA', value: 'HH08' },
  { label: 'DC01 — D0350 Notification of DCC Services at Metering Point', value: 'DC01' },
  { label: 'DC11 — D0351 Rejection of Update to DCC Service Flag', value: 'DC11' },
  { label: 'DC90 — D0172 File Summary', value: 'DC90' },
];

// ---- Half-Hourly / Non-Half-Hourly type (common to D0260 and D0217 party type fields) ----
export const HH_TYPE_OPTIONS: FormFieldOption[] = [
  { label: 'H — Half Hourly', value: 'H' },
  { label: 'N — Non-Half Hourly', value: 'N' },
];

// ---- Market Party Role Codes ----
export const ROLE_SUPP = 'SUPP';   // Supplier
export const ROLE_MOPB = 'MOPB';   // Meter Operator Business
export const ROLE_DCOL = 'DCOL';   // Data Collector
export const ROLE_HHDA = 'HHDA';   // Half-Hourly Data Aggregator
export const ROLE_CSS  = 'CSS';    // Central Switching Service

// ---- D-Flow File ----
export const DFLOW_FILE_EXT = '.usr';


// ---- CSS Message Type Codes ----
export const CSS_MSG_COS_INITIATION     = 'CSS02300_01';
export const CSS_MSG_REGISTRATION_NOTIF = 'CSS02380_01';
export const CSS_MSG_QUERY              = 'CSS02370_01';
export const CSS_MSG_QUERY_RESPONSE     = 'CSS02370_03';

// ---- Common Standing Data Field Values ----
export const CUSTOMER_CLASSIFICATION_NATP = 'NATP';   // National Tariff Profile
export const CUSTOMER_CLASSIFICATION_D    = 'D';      // Domestic
export const STANDING_DATA_STATUS_ACTIVE  = 'N';      // 'N' = normal/active in standing data records
export const VALIDATION_METHOD_VRA        = 'VRA';    // Validate Reading Automatically

// ---- D0150 Meter Location (record 290 field[4]) ----
export const METER_LOCATION_OPTIONS: FormFieldOption[] = [
  { label: 'A — Attic', value: 'A' },
  { label: 'B — Bedroom', value: 'B' },
  { label: 'C — Cellar/Basement', value: 'C' },
  { label: 'D — Other not specified', value: 'D' },
  { label: 'E — Indoors', value: 'E' },
  { label: 'F — Not known', value: 'F' },
  { label: 'G — Garage/Greenhouse', value: 'G' },
  { label: 'H — Hall', value: 'H' },
  { label: 'I — Cupboard', value: 'I' },
  { label: 'J — Intake', value: 'J' },
  { label: 'K — Kitchen', value: 'K' },
  { label: 'L — Landing', value: 'L' },
  { label: 'M — Sub Station', value: 'M' },
  { label: 'N — TC Chamber', value: 'N' },
  { label: 'O — Outbuilding/Barn', value: 'O' },
  { label: 'P — Pole', value: 'P' },
  { label: 'R — Ladder required', value: 'R' },
  { label: 'S — Understairs', value: 'S' },
  { label: 'T — Toilet', value: 'T' },
  { label: 'U — Upstairs', value: 'U' },
  { label: 'V — Vestry', value: 'V' },
  { label: 'W — Under Window', value: 'W' },
  { label: 'X — Outside Box', value: 'X' },
  { label: 'Y — O/S Box with restricted access', value: 'Y' },
  { label: 'Z — Communal Cupboard', value: 'Z' },
];

// ---- D0150 Retrieval Method (record 290 field[23]) ----
export const RETRIEVAL_METHOD_OPTIONS: FormFieldOption[] = [
  { label: 'H — Visual', value: 'H' },
  { label: 'M — Manual (Electronic Download to Hand Held Unit)', value: 'M' },
  { label: 'N — Not known at time of appointment', value: 'N' },
  { label: 'R — Remote reading', value: 'R' },
  { label: 'S — Supplier sourced HH smart meter readings', value: 'S' },
  { label: 'U — Unmetered reading', value: 'U' },
];

// ---- D0150 Meter Register Type (record 293 field[1]) ----
export const METER_REGISTER_TYPE_OPTIONS: FormFieldOption[] = [
  { label: 'C — Cumulative', value: 'C' },
  { label: 'M — Maximum Demand', value: 'M' },
  { label: '1 — Cumulative Maximum Demand', value: '1' },
  { label: '2 — Month End Cumulative', value: '2' },
  { label: '3 — Month End Maximum Demand', value: '3' },
  { label: '4 — Month End Cumulative Maximum Demand', value: '4' },
];

