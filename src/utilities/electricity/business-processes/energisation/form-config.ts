// ============================================================
// Energisation — Form Group Definitions
// ============================================================

import type { FormGroupDefinition } from '../../../../shared/domain/types';
import {
  TEST_FLAG_OPTIONS,
  PROFILE_CLASS_OPTIONS,
  MEASUREMENT_CLASS_OPTIONS,
  GSP_GROUP_OPTIONS,
  METER_TYPE_OPTIONS,
  MEASUREMENT_QUANTITY_OPTIONS,
  READING_TYPE_OPTIONS,
  ENERGISATION_ACTION_OPTIONS,
  ENERGISATION_REASON_OPTIONS,
  METER_LOCATION_OPTIONS,
  RETRIEVAL_METHOD_OPTIONS,
  METER_REGISTER_TYPE_OPTIONS,
} from '../../industry-constants';

function localDateISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const energisationFormGroups: FormGroupDefinition[] = [
  {
    id: 'file-settings',
    label: 'File Settings',
    icon: '⚙',
    fields: [
      {
        id: 'testFlag',
        label: 'Test Flag',
        type: 'select',
        required: true,
        defaultValue: 'OPER',
        options: TEST_FLAG_OPTIONS,
      },
      {
        id: 'fileDate',
        label: 'File Date',
        type: 'date',
        required: true,
        defaultValue: localDateISO(),
      },
    ],
  },
  {
    id: 'market-parties',
    label: 'Market Parties',
    icon: '🏢',
    fields: [
      // ---- Supplier ----
      { id: 'supplierRoleCode',         label: 'Supplier Role Code',          type: 'text', required: true, defaultValue: 'X' },
      { id: 'supplierParticipantId',    label: 'Supplier Participant ID',     type: 'text', required: true, defaultValue: 'GMTR' },
      // ---- MOP ----
      { id: 'mopRoleCode',              label: 'MOP Role Code',               type: 'text', required: true },
      { id: 'mopParticipantId',         label: 'MOP Participant ID',          type: 'text', required: true },
      // ---- Data Collector (DC) ----
      { id: 'dcRoleCode',               label: 'Data Collector Role Code',    type: 'text', required: true },
      { id: 'dcParticipantId',          label: 'Data Collector Participant ID', type: 'text', required: true },
      // ---- Distributor ----
      { id: 'distributorRoleCode',      label: 'Distributor Role Code',       type: 'text', required: true },
      { id: 'distributorParticipantId', label: 'Distributor Participant ID',  type: 'text', required: true },
    ],
  },
  {
    id: 'supply-point',
    label: 'Supply Point',
    icon: '⚡',
    fields: [
      {
        id: 'mpan',
        label: 'MPAN',
        type: 'text',
        required: true,
        placeholder: '1200012345678',
        maxLength: 13,
        helpText: '13-digit MPAN',
      },
      {
        id: 'msn',
        label: 'Meter Serial Number',
        type: 'text',
        required: true,
        placeholder: 'MSN12345678',
      },
    ],
  },
  {
    id: 'energisation-request',
    label: 'Energisation / De-energisation Request',
    icon: '🔌',
    fields: [
      {
        id: 'actionRequired',
        label: 'Action Required',
        type: 'select',
        required: true,
        defaultValue: 'E',
        options: ENERGISATION_ACTION_OPTIONS,
        helpText: 'Type of action to perform',
      },
      {
        id: 'requestedDate',
        label: 'Requested Date',
        type: 'date',
        required: true,
        helpText: 'Date energisation is required',
      },
      {
        id: 'reasonCode',
        label: 'Reason Code',
        type: 'select',
        required: true,
        defaultValue: '01',
        options: ENERGISATION_REASON_OPTIONS,
      },
      {
        id: 'accessDetails',
        label: 'Access Details',
        type: 'text',
        required: false,
        placeholder: 'Key safe code 1234',
        helpText: 'Any access instructions for MOP',
      },
      {
        id: 'contactName',
        label: 'Contact Name',
        type: 'text',
        required: false,
        placeholder: 'John Smith',
      },
      {
        id: 'contactNumber',
        label: 'Contact Number',
        type: 'text',
        required: false,
        placeholder: '07700900000',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical Attributes',
    icon: '📊',
    fields: [
      {
        id: 'profileClass',
        label: 'Profile Class',
        type: 'select',
        required: true,
        options: PROFILE_CLASS_OPTIONS,
      },
      {
        id: 'measurementClass',
        label: 'Measurement Class',
        type: 'select',
        required: true,
        options: MEASUREMENT_CLASS_OPTIONS,
      },
      {
        id: 'gspGroupId',
        label: 'GSP Group ID',
        type: 'select',
        required: true,
        options: GSP_GROUP_OPTIONS,
      },
      {
        id: 'llfClass',
        label: 'Line Loss Factor Class',
        type: 'text',
        required: true,
        placeholder: '001',
        maxLength: 3,
      },
      {
        id: 'ssc',
        label: 'Standard Settlement Config',
        type: 'text',
        required: false,
        placeholder: '0000',
        maxLength: 4,
      },
    ],
  },
  {
    id: 'meter-details',
    label: 'Meter Technical Details',
    icon: '🔧',
    fields: [
      // D0150 290[5] — Manufacturers Make & Type
      {
        id: 'meterMake',
        label: 'Meter Make',
        type: 'text',
        required: true,
        placeholder: 'EDMI',
        helpText: 'Manufacturer name — D0150 290[5]',
      },
      {
        id: 'meterModel',
        label: 'Meter Model / Type',
        type: 'text',
        required: false,
        placeholder: 'AtlasMk10A',
        helpText: 'Model designation — D0150 290[5]',
      },
      // D0150 290[18]
      {
        id: 'meterInstalledDate',
        label: 'Meter Installed Date',
        type: 'date',
        required: true,
        helpText: 'Date meter was installed — D0150 290[18]',
      },
      // D0150 291[0]
      {
        id: 'ctPrimaryRatio',
        label: 'CT Ratio',
        type: 'text',
        required: true,
        placeholder: '200/5',
        helpText: 'Current Transformer ratio — D0150 291[0] (e.g. 200/5 or 1 for NHH)',
      },
      // Remaining meter fields (D0052 / D0260)
      {
        id: 'meterType',
        label: 'Meter Type',
        type: 'select',
        required: true,
        options: METER_TYPE_OPTIONS,
      },
      {
        id: 'mtc',
        label: 'Meter Timeswitch Code',
        type: 'text',
        required: true,
        placeholder: '001',
        maxLength: 3,
      },
      {
        id: 'vtPrimaryRatio',
        label: 'VT Primary Ratio',
        type: 'text',
        required: true,
        helpText: 'Voltage Transformer ratio (1 for NHH)',
      },
      {
        id: 'timePatternRegiment',
        label: 'Time Pattern Regiment',
        type: 'text',
        required: true,
        maxLength: 5,
        helpText: '5-digit TPR code — D0149 778[0]',
      },
      {
        id: 'scalingFactor',
        label: 'Scaling Factor',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    id: 'readings',
    label: 'Readings & Consumption',
    icon: '📈',
    fields: [
      {
        id: 'readingDate',
        label: 'Reading Date',
        type: 'date',
        required: true,
      },
      {
        id: 'readingType',
        label: 'Reading Type',
        type: 'select',
        required: true,
        options: READING_TYPE_OPTIONS,
        helpText: 'Read type as expected by D0149 / D0010',
      },
      {
        id: 'readingValue',
        label: 'Meter Reading',
        type: 'text',
        required: true,
        placeholder: '00000',
        helpText: 'Numeric reading value',
      },
      {
        id: 'estimatedAnnualConsumption',
        label: 'EAC (kWh)',
        type: 'number',
        required: true,
      },
    ],
  },
  {
    id: 'register-details',
    label: 'Register Details',
    icon: '📋',
    fields: [
      // D0150 293 sequence ↓
      {
        id: 'registerId',
        label: 'Register ID',
        type: 'text',
        required: true,
        maxLength: 2,
        helpText: "D0149 284[1] / D0150 293[0] — 'S' for NHH single register, or '01'",
      },
      {
        id: 'meterRegisterType',
        label: 'Meter Register Type',
        type: 'select',
        required: true,
        defaultValue: 'C',
        options: METER_REGISTER_TYPE_OPTIONS,
        helpText: 'D0150 293[1]',
      },
      {
        id: 'measurementQuantityId',
        label: 'Measurement Quantity ID',
        type: 'select',
        required: true,
        options: MEASUREMENT_QUANTITY_OPTIONS,
        helpText: 'D0150 293[2] / D0149 body',
      },
      {
        id: 'registerMappingCoefficient',
        label: 'Register Mapping Coefficient',
        type: 'text',
        required: true,
        defaultValue: '1.00',
        helpText: 'D0149 284[2] / D0150 293[3] — e.g. 1 or 1.00',
      },
      {
        id: 'numberOfDigits',
        label: 'Number of Register Digits',
        type: 'text',
        required: true,
        placeholder: '7',
        helpText: 'D0150 293[5]',
      },
      // D0150 290 sequence ↓
      {
        id: 'meterLocation',
        label: 'Meter Location',
        type: 'select',
        required: true,
        defaultValue: 'J',
        options: METER_LOCATION_OPTIONS,
        helpText: 'D0150 290[4] — where the meter is physically installed',
      },
      {
        id: 'meterAssetProviderId',
        label: 'Meter Asset Provider ID (MAP)',
        type: 'text',
        required: true,
        placeholder: 'UFUN',
        helpText: 'D0150 290[6] — MAP participant ID',
      },
      {
        id: 'd0150MeterType',
        label: 'Meter Type Code (D0150)',
        type: 'text',
        required: true,
        placeholder: 'RCAMY',
        helpText: 'D0150 290[17] — MAP-assigned meter equipment type code',
      },
      {
        id: 'certificationDate',
        label: 'Meter Certification Date',
        type: 'date',
        required: true,
        helpText: 'D0150 290[19] — date meter was certified',
      },
      {
        id: 'retrievalMethod',
        label: 'Retrieval Method',
        type: 'select',
        required: true,
        defaultValue: 'R',
        options: RETRIEVAL_METHOD_OPTIONS,
        helpText: 'D0150 290[23] — how meter readings are retrieved',
      },
      {
        id: 'retrievalMethodEffectiveDate',
        label: 'Retrieval Method Effective Date',
        type: 'date',
        required: true,
        helpText: 'D0150 290[24] — date retrieval method takes effect',
      },
    ],
  },
];
