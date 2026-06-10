// HH Advanced COS Registration — Form Group Definitions

import type { FormGroupDefinition } from '../../../../shared/domain/types';
import {
  TEST_FLAG_OPTIONS,
  INSTRUCTION_TYPE_OPTIONS,
  HH_TYPE_OPTIONS,
  ENERGISATION_STATUS_OPTIONS,
  PROFILE_CLASS_OPTIONS,
  MEASUREMENT_CLASS_OPTIONS,
  GSP_GROUP_OPTIONS,
  METER_COP_OPTIONS,
  EVENT_INDICATOR_OPTIONS,
  FEEDER_STATUS_OPTIONS,
  COMPLEX_SITE_OPTIONS,
  NUMBER_OF_PHASES_OPTIONS,
  MEASUREMENT_QUANTITY_OPTIONS,
  RETRIEVAL_METHOD_OPTIONS,
  HH_ACTUAL_ESTIMATED_OPTIONS,
} from '../../industry-constants';

function localDateISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const hhCOSRegistrationFormGroups: FormGroupDefinition[] = [
  {
    id: 'file-settings',
    label: 'File Details',
    icon: '⚙',
    fields: [
      { id: 'testFlag', label: 'Test Flag', type: 'select', required: true, defaultValue: 'OPER', options: TEST_FLAG_OPTIONS },
      { id: 'fileDate', label: 'File Date', type: 'date', required: true, defaultValue: localDateISO(), helpText: 'Date used in file headers (YYYYMMDD)' },
    ],
  },
  {
    id: 'css-registration',
    label: 'CSS Registration',
    icon: '🔗',
    fields: [
      { id: 'supplierGeneratedReference', label: 'Supplier Generated Reference', type: 'text', required: true, placeholder: 'SC000000549' },
      { id: 'cssCorrelationId',           label: 'Correlation ID',               type: 'text', required: true, placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { id: 'registrationRequestId',      label: 'Registration ID',              type: 'text', required: true, placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      {
        id: 'timestampFormat', label: 'Timestamp Format', type: 'select', required: true, defaultValue: 'utc',
        options: [
          { value: 'utc',   label: 'UTC (e.g. 10:30:00.000Z)' },
          { value: 'local', label: 'Local system clock (e.g. 11:30:00.000)' },
        ],
      },
    ],
  },
  {
    id: 'market-parties',
    label: 'Market Parties',
    icon: '🏢',
    fields: [
      { id: 'supplierRoleCode',         label: 'New Supplier Role Code',             type: 'text', required: true, defaultValue: 'X', maxLength: 1 },
      { id: 'supplierParticipantId',    label: 'New Supplier Participant ID',        type: 'text', required: true, defaultValue: 'GMTR' },
      { id: 'oldSupplierRoleCode',      label: 'Old Supplier Role Code',             type: 'text', required: true, defaultValue: 'X', maxLength: 1 },
      { id: 'oldSupplierParticipantId', label: 'Old Supplier Participant ID',        type: 'text', required: true },
      { id: 'distributorRoleCode',      label: 'Distributor / MPAS Role Code',       type: 'text', required: true, defaultValue: 'P', maxLength: 1 },
      { id: 'distributorParticipantId', label: 'Distributor / MPAS Participant ID',  type: 'text', required: true },
      { id: 'mopRoleCode',              label: 'New MOP Role Code',                  type: 'text', required: true, defaultValue: 'M', maxLength: 1 },
      { id: 'mopParticipantId',         label: 'New MOP Participant ID',             type: 'text', required: true },
      { id: 'daRoleCode',               label: 'New Data Aggregator Role Code',      type: 'text', required: true, defaultValue: 'A', maxLength: 1 },
      { id: 'daParticipantId',          label: 'New Data Aggregator Participant ID', type: 'text', required: true },
      { id: 'dcRoleCode',               label: 'New Data Collector Role Code',       type: 'text', required: true, defaultValue: 'C', maxLength: 1 },
      { id: 'dcParticipantId',          label: 'New Data Collector Participant ID',  type: 'text', required: true },
    ],
  },
  {
    id: 'supply-point',
    label: 'Supply Point',
    icon: '⚡',
    fields: [
      { id: 'mpan',               label: 'MPAN',                    type: 'text',   required: true, placeholder: '1200012345678', maxLength: 13 },
      { id: 'registrationDate',   label: 'Registration Date',       type: 'date',   required: true, helpText: 'New supply start / COS effective date' },
      { id: 'cosDate',            label: 'Change of Supplier Date', type: 'date',   required: true },
      { id: 'instructionNumber',  label: 'Instruction Number',      type: 'text',   required: true, placeholder: '17658' },
      { id: 'instructionType',    label: 'D0260 Instruction Type',  type: 'select', required: true, defaultValue: 'SP43', options: INSTRUCTION_TYPE_OPTIONS },
      { id: 'd0217InstructionType', label: 'D0217 Instruction Type', type: 'select', required: true, defaultValue: 'SP40', options: INSTRUCTION_TYPE_OPTIONS },
      { id: 'energisationStatus', label: 'Energisation Status',     type: 'select', required: true, defaultValue: 'E', options: ENERGISATION_STATUS_OPTIONS },
      { id: 'aggrType',           label: 'Data Aggregation Type',   type: 'select', required: true, defaultValue: 'H', options: HH_TYPE_OPTIONS },
      { id: 'collectorType',      label: 'Data Collector Type',     type: 'select', required: true, defaultValue: 'H', options: HH_TYPE_OPTIONS },
      { id: 'mopType',            label: 'Meter Operator Type',     type: 'select', required: true, defaultValue: 'H', options: HH_TYPE_OPTIONS },
      { id: 'postcode',           label: 'Postcode',                type: 'text',   required: true, placeholder: 'GU1 4HN' },
      { id: 'contractRefMop', label: 'MOP Contract Reference', type: 'text', required: true, placeholder: 'GMTRMOP001', helpText: 'D0011 034[2] — MOP' },
      { id: 'contractRefDc',  label: 'DC Contract Reference',  type: 'text', required: true, placeholder: 'GMTRDC001',  helpText: 'D0011 034[2] — DC' },
      { id: 'contractRefDa',  label: 'DA Contract Reference',  type: 'text', required: true, placeholder: 'GMTRDA001',  helpText: 'D0011 034[2] — DA' },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Attributes',
    icon: '📊',
    fields: [
      { id: 'profileClass',     label: 'Profile Class',                              type: 'select', required: true, defaultValue: '00', options: PROFILE_CLASS_OPTIONS },
      { id: 'measurementClass', label: 'Measurement Class',                          type: 'select', required: true, options: MEASUREMENT_CLASS_OPTIONS },
      { id: 'gspGroupId',       label: 'GSP Group ID',                               type: 'select', required: true, options: GSP_GROUP_OPTIONS },
      { id: 'llfClass',         label: 'Line Loss Factor Class',                     type: 'text',   required: true, placeholder: '001', maxLength: 3 },
      { id: 'retrievalMethod',  label: 'Retrieval Method',                           type: 'select', required: true, defaultValue: 'M', options: RETRIEVAL_METHOD_OPTIONS, helpText: 'D0051 120[2]' },
    ],
  },
  {
    id: 'meter-cop-details',
    label: 'MPAN Attributes (01A)',
    icon: '📋',
    fields: [
      { id: 'meterCop',             label: 'Meter COP',              type: 'select', required: true, defaultValue: '5', options: METER_COP_OPTIONS,    helpText: 'D0268 01A[3]' },
      { id: 'meterCopIssueNumber',  label: 'Meter COP Issue Number', type: 'text',   required: true, defaultValue: '6',                                  helpText: 'D0268 01A[4]' },
      { id: 'complexSiteIndicator', label: 'Complex Site Indicator', type: 'select', required: true, defaultValue: 'F', options: COMPLEX_SITE_OPTIONS,  helpText: 'D0268 01A[5]' },
      { id: 'systemVoltage',        label: 'System Voltage',         type: 'text',   required: true, defaultValue: '415',                                helpText: 'D0268 01A[7]' },
      { id: 'numberOfPhases',       label: 'Number of Phases',       type: 'select', required: true, defaultValue: '3', options: NUMBER_OF_PHASES_OPTIONS, helpText: 'D0268 01A[8]' },
      { id: 'eventIndicator',       label: 'Event Indicator',        type: 'select', required: true, defaultValue: 'J', options: EVENT_INDICATOR_OPTIONS, helpText: 'D0268 01A[9]' },
    ],
  },
  // ---- 02A — Outstation Details (independent repeatable) ----
  {
    id: 'outstation-details',
    label: 'Outstation Details (02A)',
    icon: '📡',
    repeatable: true,
    blockLabel: 'Outstation',
    addLabel: 'Add Another Outstation',
    fields: [
      { id: 'outstationId',       label: 'Outstation ID',                 type: 'text',   required: true,  placeholder: 'OutstationID',  helpText: 'D0268 02A[1] — MSN + O1, O2 etc.' },
      { id: 'outstationType',     label: 'Outstation Type',               type: 'text',   required: true,  defaultValue: 'VIS',   helpText: 'D0268 02A[2]' },
      { id: 'modemType',          label: 'Modem Type',                    type: 'text',   required: false,                        helpText: 'D0268 02A[3]' },
      { id: 'outstationChannels', label: 'Number of Channels',            type: 'text',   required: true,  defaultValue: '3',     helpText: 'D0268 02A[4]' },
      { id: 'outstationDials',    label: 'Number of Dials',               type: 'text',   required: true,  placeholder: '6',      helpText: 'D0268 02A[5]' },
      { id: 'outstationPin',      label: 'PIN',                           type: 'text',   required: false, placeholder: '001',    helpText: 'D0268 02A[6]' },
      { id: 'usernameL1',         label: 'Username Level 1',              type: 'text',   required: false,                        helpText: 'D0268 02A[7]' },
      { id: 'passwordL1',         label: 'Password Level 1',              type: 'text',   required: false,                        helpText: 'D0268 02A[8]' },
      { id: 'usernameL2',         label: 'Username Level 2',              type: 'text',   required: false,                        helpText: 'D0268 02A[9]' },
      { id: 'passwordL2',         label: 'Password Level 2',              type: 'text',   required: false,                        helpText: 'D0268 02A[10]' },
      { id: 'usernameL3',         label: 'Username Level 3',              type: 'text',   required: false,                        helpText: 'D0268 02A[11]' },
      { id: 'passwordL3',         label: 'Password Level 3',              type: 'text',   required: false,                        helpText: 'D0268 02A[12]' },
      { id: 'readerPassword',     label: 'Reader Password',               type: 'text',   required: false,                        helpText: 'D0268 02A[13]' },
      { id: 'commAddressType',    label: 'Communication Address Type',    type: 'text',   required: true,  defaultValue: 'IP',    helpText: 'D0268 02A[14]' },
      { id: 'commMethodB',        label: 'Communications Method B',       type: 'text',   required: false,                        helpText: 'D0268 02A[15]' },
      { id: 'dialIndicator',      label: 'Dial In/Out Indicator',         type: 'text',   required: false,                        helpText: 'D0268 02A[16]' },
      { id: 'commAddress',        label: 'Communications Address',        type: 'text',   required: false, placeholder: '10.0.0.1:8080', helpText: 'D0268 02A[17]' },
      { id: 'commAddressB',       label: 'Communications Address B',      type: 'text',   required: false,                        helpText: 'D0268 02A[18]' },
      { id: 'baudRate',           label: 'Baud Rate',                     type: 'text',   required: false, placeholder: '9600',   helpText: 'D0268 02A[19]' },
      { id: 'commProvider',       label: 'Communications Provider',       type: 'text',   required: false,                        helpText: 'D0268 02A[20]' },
      { id: 'simSerial',          label: 'SIM Serial Number',             type: 'text',   required: false,                        helpText: 'D0268 02A[21]' },
      { id: 'seqMpan',            label: 'Sequence MPAN Core',            type: 'text',   required: false,                        helpText: 'D0268 02A[22]' },
      { id: 'seqOutstationId',    label: 'Sequence Outstation ID',        type: 'text',   required: false,                        helpText: 'D0268 02A[23]' },
    ],
  },
  // ---- 03A — Meter Details (repeatable) with nested 04A registers ----
  {
    id: 'meter-register-details',
    label: 'Meter & Register Details (03A / 04A)',
    icon: '🔧',
    repeatable: true,
    blockLabel: 'Meter',
    addLabel: 'Add Another Meter',
    fields: [
      { id: 'msn',                      label: 'Meter Serial Number',          type: 'text',   required: true,  placeholder: 'K21W003729',         helpText: 'D0268 03A[1]' },
      { id: 'manufacturersMakeAndType', label: 'Manufacturers Make & Type',    type: 'text',   required: false, placeholder: 'ABB LV CT MU Vision', helpText: 'D0268 03A[2]' },
      { id: 'meterInstalledDate',       label: 'Meter Installed Date',         type: 'date',   required: true,                                       helpText: 'D0268 03A[3]' },
      { id: 'meterCurrentRating',       label: 'Meter Current Rating',         type: 'text',   required: false,                                      helpText: 'D0268 03A[4]' },
      { id: 'vtRatio',                  label: 'VT Ratio',                     type: 'text',   required: false,                                      helpText: 'D0268 03A[5]' },
      { id: 'ctRatio',                  label: 'CT Ratio',                     type: 'text',   required: false, placeholder: '200/5',               helpText: 'D0268 03A[6]' },
      { id: 'phaseWire',                label: 'Phase/Wire',                   type: 'text',   required: false, placeholder: '3P4W',                helpText: 'D0268 03A[7]' },
      { id: 'feederStatus',             label: 'Feeder Status',                type: 'select', required: true,  defaultValue: 'A', options: FEEDER_STATUS_OPTIONS, helpText: 'D0268 03A[8]' },
      { id: 'feederStatusEffectiveDate', label: 'Feeder Status Effective Date', type: 'date',  required: true,                                       helpText: 'D0268 03A[9]' },
      { id: 'meterAssetProviderId',     label: 'Meter Asset Provider ID (MAP)', type: 'text',  required: true,  placeholder: 'SIEM',                helpText: 'D0268 03A[10]' },
    ],
    innerRepeatable: {
      id: 'registers',
      label: 'Register Details (04A)',
      addLabel: 'Add Another Register (04A)',
      fields: [
        { id: 'meterRegisterId',           label: 'Meter Register ID',          type: 'text',   required: true,  defaultValue: '10',       helpText: 'D0268 04A[1]' },
        { id: 'reg_outstationId',          label: 'Outstation ID',              type: 'text',   required: true,  placeholder: 'OutstationID',     helpText: 'D0268 04A[2] — links to 02A' },
        { id: 'channelNumber',             label: 'Channel Number',             type: 'text',   required: true,  defaultValue: '006',      helpText: 'D0268 04A[3]' },
        { id: 'pulseMultiplier',           label: 'Pulse Multiplier',           type: 'text',   required: true,  defaultValue: '1.000000', helpText: 'D0268 04A[4]' },
        { id: 'meterRegisterMultiplier',   label: 'Meter Register Multiplier',  type: 'text',   required: true,  defaultValue: '1.00',     helpText: 'D0268 04A[5]' },
        { id: 'outstationMultiplier',      label: 'Outstation Multiplier',      type: 'text',   required: true,  defaultValue: '1.0000',   helpText: 'D0268 04A[6]' },
        { id: 'measurementQuantityId',     label: 'Measurement Quantity ID',    type: 'select', required: true,  options: MEASUREMENT_QUANTITY_OPTIONS, helpText: 'D0268 04A[7]' },
        { id: 'numberOfRegisterDigits',    label: 'Number of Register Digits',  type: 'text',   required: true,  defaultValue: '6',        helpText: 'D0268 04A[8]' },
        { id: 'associatedMeterId',         label: 'Associated Meter ID',        type: 'text',   required: false,                           helpText: 'D0268 04A[9]' },
        { id: 'associatedMeterRegisterId', label: 'Associated Meter Register',  type: 'text',   required: false,                           helpText: 'D0268 04A[10]' },
      ],
    },
  },
  // ---- D0036 — HH Consumption (DC → Supplier) — repeatable per settlement date ----
  {
    id: 'hh-consumption',
    label: 'HH Consumption (D0036)',
    icon: '📊',
    repeatable: true,
    blockLabel: 'Settlement Date',
    addLabel: 'Add Another Settlement Date',
    blockFieldsClass: 'register-block-fields--compact',
    fields: [
      {
        id: 'hhSettlementDate',
        label: 'Settlement Date',
        type: 'date',
        required: true,
      },
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
      { id: 'hh-periods-heading', label: '48 half-hour intervals', type: 'heading', required: false },
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
