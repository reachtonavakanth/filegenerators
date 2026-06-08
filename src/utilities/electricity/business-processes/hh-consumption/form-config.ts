// HH Consumption Data (D0036) — Form Group Definitions
// DC → Supplier: one 101, one 102, 48 × 103 per settlement date

import type { FormGroupDefinition, FormFieldDefinition } from '../../../../shared/domain/types';
import {
  TEST_FLAG_OPTIONS,
  MEASUREMENT_QUANTITY_OPTIONS,
  HH_ACTUAL_ESTIMATED_OPTIONS,
} from '../../industry-constants';

function localDateISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function periodFields(): FormFieldDefinition[] {
  const fields: FormFieldDefinition[] = [
    {
      id: 'hhIndicator',
      label: 'Actual/Estimated Indicator',
      type: 'select',
      required: true,
      defaultValue: 'A',
      options: HH_ACTUAL_ESTIMATED_OPTIONS,
      helpText: 'Applied to all 48 periods',
    },
    {
      id: 'periods-heading',
      label: 'Period Metered Consumption (kWh)',
      type: 'heading',
      required: false,
    },
  ];

  for (let i = 1; i <= 48; i++) {
    const idx = String(i).padStart(2, '0');
    const startH = Math.floor((i - 1) / 2);
    const startM = ((i - 1) % 2) * 30;
    const endH = Math.floor(i / 2) % 24;
    const endM = (i % 2) * 30;
    const timeLabel = `${String(startH).padStart(2, '0')}:${String(startM).padStart(2, '0')}–${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
    fields.push({
      id: `period_${idx}`,
      label: `Period ${idx}`,
      type: 'text',
      required: true,
      placeholder: '0.0',
      helpText: timeLabel,
    });
  }

  return fields;
}

export const hhConsumptionFormGroups: FormGroupDefinition[] = [
  {
    id: 'file-settings',
    label: 'File Details',
    icon: '⚙',
    fields: [
      { id: 'testFlag', label: 'Test Flag', type: 'select', required: true, defaultValue: 'OPER', options: TEST_FLAG_OPTIONS },
      { id: 'fileDate', label: 'File Date', type: 'date', required: true, defaultValue: localDateISO(), helpText: 'Date used in file header (YYYYMMDD)' },
    ],
  },
  {
    id: 'parties',
    label: 'Market Parties',
    icon: '🏢',
    fields: [
      { id: 'dcRoleCode',          label: 'DC Role Code',          type: 'text', required: true, defaultValue: 'C', maxLength: 1 },
      { id: 'dcParticipantId',     label: 'DC Participant ID',     type: 'text', required: true, placeholder: 'SSIL' },
      { id: 'supplierRoleCode',    label: 'Supplier Role Code',    type: 'text', required: true, defaultValue: 'X', maxLength: 1 },
      { id: 'supplierParticipantId', label: 'Supplier Participant ID', type: 'text', required: true, placeholder: 'GMTR' },
    ],
  },
  {
    id: 'hh-consumption',
    label: 'HH Consumption',
    icon: '📊',
    fields: [
      { id: 'mpan',                  label: 'MPAN',                      type: 'text',   required: true, placeholder: '1014568234275', maxLength: 13 },
      { id: 'measurementQuantityId', label: 'Measurement Quantity ID',   type: 'select', required: true, defaultValue: 'AI', options: MEASUREMENT_QUANTITY_OPTIONS },
      { id: 'settlementDate',        label: 'Settlement Date',           type: 'date',   required: true, helpText: 'D0036 102[0] — date for which the 48 periods apply' },
      ...periodFields(),
    ],
  },
];
