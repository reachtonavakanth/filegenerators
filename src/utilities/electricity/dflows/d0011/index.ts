// D0011 — Provide Standing Data (Appointment Notification)
// File structure: ZHV → 034 → 035|036|037 → 038 → ZPT
//
// Three variants — differ only in the middle record:
//   DA  appointment → 037|cosDate|
//   DC  appointment → 035|cosDate|
//   MOP appointment → 036|cosDate|
//
// 034|mpan|contractRef|cosDate|
// 038|registerRef|registerRef|   (same value both fields, alphanumeric max 4)

import { DFLOW_FILE_EXT } from '../../industry-constants';
import type { DFlowFile, DFlowEnvelope } from '../../../../shared/domain/types';

export type D0011AppointmentType = 'DA' | 'DC' | 'MOP';

const APPOINTMENT_RECORD_TYPE: Record<D0011AppointmentType, string> = {
  DA:  '037',
  DC:  '035',
  MOP: '036',
};

export interface D0011_034 {
  mpan: string;         // field[1]
  contractRef: string;  // field[2] — contract reference, alphanumeric
  cosDate: string;      // field[3] — Change of Supplier date YYYYMMDD
}

export interface D0011Model {
  envelope: DFlowEnvelope;
  appointmentType: D0011AppointmentType;
  record034: D0011_034;
  appointmentDate: string;  // date for the middle record (035/036/037) — cosDate
  registerRef: string;      // 038 Service Reference (field[1]) & Service Level Reference (field[2]) — same value, alphanumeric max 4
}

export function buildD0011(model: D0011Model): DFlowFile {
  const { envelope, record034: r, appointmentType } = model;
  const middleRecord = APPOINTMENT_RECORD_TYPE[appointmentType];
  return {
    envelope,
    fileName: `${envelope.xRef}${DFLOW_FILE_EXT}`,
    trailerType: 'ZPT',
    records: [
      { recordType: '034', fields: [r.mpan, r.contractRef, r.cosDate] },
      { recordType: middleRecord, fields: [model.appointmentDate] },
      { recordType: '038', fields: [model.registerRef, model.registerRef] },
    ],
  };
}
