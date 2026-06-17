// Standalone HH Consumption (D0036) — Form Group Definitions

import type { FormGroupDefinition } from '../../../../shared/domain/types';
import {
  TEST_FLAG_OPTIONS,
  MEASUREMENT_QUANTITY_OPTIONS,
  HH_ACTUAL_ESTIMATED_OPTIONS,
} from '../../industry-constants';

function localDateISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const hhD0036FormGroups: FormGroupDefinition[] = [
  {
    id: 'file-settings',
    label: 'File Details',
    icon: '⚙',
    fields: [
      { id: 'testFlag', label: 'Test Flag', type: 'select', required: true, defaultValue: 'OPER', options: TEST_FLAG_OPTIONS },
      { id: 'fileDate', label: 'File Date', type: 'date', required: true, defaultValue: localDateISO(), helpText: 'Date used in ZHV creation timestamp' },
    ],
  },
  {
    id: 'parties',
    label: 'Market Parties',
    icon: '🏢',
    fields: [
      { id: 'dcRoleCode',            label: 'DC Role Code',            type: 'text', required: true, defaultValue: 'C', maxLength: 1 },
      { id: 'dcParticipantId',       label: 'DC Participant ID',       type: 'text', required: true, placeholder: 'SSIL' },
      { id: 'supplierRoleCode',      label: 'Supplier Role Code',      type: 'text', required: true, defaultValue: 'X', maxLength: 1 },
      { id: 'supplierParticipantId', label: 'Supplier Participant ID', type: 'text', required: true, defaultValue: 'GMTR', helpText: '101[2]' },
    ],
  },
  {
    id: 'supply-point',
    label: 'Supply Point',
    icon: '⚡',
    fields: [
      { id: 'mpan', label: 'MPAN', type: 'text', required: true, placeholder: '1014572465589', maxLength: 13 },
    ],
  },
  {
    id: 'hh-date-range',
    label: 'Settlement Date Range',
    icon: '📅',
    fields: [
      { id: 'hhStartDate',    label: 'Start Date',          type: 'date',   required: true,  defaultValue: localDateISO(), helpText: 'First settlement date — one .usr file per day' },
      { id: 'hhEndDate',      label: 'End Date',            type: 'date',   required: true,  defaultValue: localDateISO(), helpText: 'Last settlement date (inclusive)' },
      { id: 'hhLowDayFactor', label: 'Even Day Multiplier', type: 'number', required: false, defaultValue: '0.3', step: '0.01', helpText: 'Odd days use values as-is from the form. Even days multiply each interval by this factor.' },
    ],
  },
  // ---- Measurement Quantity blocks — one per MQID, 48 intervals each ----
  {
    id: 'hh-mqid-blocks',
    label: 'Measurement Quantities',
    icon: '📊',
    repeatable: true,
    blockLabel: 'Measurement Quantity',
    addLabel: 'Add Another Measurement Quantity',
    blockFieldsClass: 'register-block-fields--compact',
    fields: [
      {
        id: 'hhMeasurementQuantityId',
        label: 'Measurement Quantity ID',
        type: 'select',
        required: true,
        defaultValue: 'AI',
        options: MEASUREMENT_QUANTITY_OPTIONS,
      },
      {
        id: 'hhAutoFill',
        label: '⚡ Auto-fill Intervals',
        type: 'fill-action',
        required: false,
        fillTargets: Array.from({ length: 48 }, (_, i) => `p${String(i + 1).padStart(2, '0')}Val`),
        fillRange: { min: 5.0, max: 15.0, decimals: 1 },
      },
      { id: 'hh-periods-heading', label: '48 half-hour intervals (same values applied to every time interval across the range)', type: 'heading', required: false },
      ...Array.from({ length: 48 }, (_, i) => {
        const n = i + 1;
        const idx = String(n).padStart(2, '0');
        const endH = Math.floor(n / 2) % 24;
        const endM = (n % 2) * 30;
        const endTime = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
        return [
          {
            id: `p${idx}Ind` as const,
            label: `Interval ${idx} (${endTime})`,
            type: 'select' as const,
            required: false,
            defaultValue: 'A',
            options: HH_ACTUAL_ESTIMATED_OPTIONS,
          },
          {
            id: `p${idx}Val` as const,
            label: `Interval ${idx} (kWh)`,
            type: 'number' as const,
            required: false,
            placeholder: '0.0',
            step: '0.1',
          },
        ];
      }).flat(),
    ],
  },
];
