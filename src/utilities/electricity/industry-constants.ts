// ============================================================
// UK Electricity Market Reference Data
// Single source of truth for all dropdown option lists.
// Update here when market codes change — form configs auto-update.
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
  { label: 'RI — Reactive Import', value: 'RI' },
  { label: 'AQ — Active Export', value: 'AQ' },
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

export const ENERGISATION_ACTION_OPTIONS: FormFieldOption[] = [
  { label: 'E — Energise', value: 'E' },
  { label: 'D — De-energise', value: 'D' },
];

export const ENERGISATION_REASON_OPTIONS: FormFieldOption[] = [
  { label: '01 — New Supply', value: '01' },
  { label: '02 — CoS', value: '02' },
  { label: '03 — Re-energisation', value: '03' },
  { label: '04 — Prepayment Reinstatement', value: '04' },
  { label: '05 — Safety', value: '05' },
  { label: '06 — Theft', value: '06' },
];
