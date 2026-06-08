// HH Consumption Data (D0036) — Domain Model

import type { TestFlag } from '../../../../shared/domain/types';

export interface HHConsumptionModel {
  testFlag: TestFlag;
  fileDate: string;

  dcRoleCode: string;
  dcParticipantId: string;
  supplierRoleCode: string;
  supplierParticipantId: string;

  mpan: string;
  measurementQuantityId: string;
  settlementDate: string;

  hhIndicator: string;    // A / C / E — applied to all 48 periods
  periods: string[];      // 48 consumption values (index 0 = period 01)
}

export function mapFormToHHConsumptionModel(inputs: Record<string, string>): HHConsumptionModel {
  const periods: string[] = [];
  for (let i = 1; i <= 48; i++) {
    const key = `period_${String(i).padStart(2, '0')}`;
    periods.push(inputs[key] || '0.0');
  }

  return {
    testFlag: (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate: inputs['fileDate'] || '',
    dcRoleCode: inputs['dcRoleCode'] || 'C',
    dcParticipantId: inputs['dcParticipantId'] || '',
    supplierRoleCode: inputs['supplierRoleCode'] || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || '',
    mpan: inputs['mpan'] || '',
    measurementQuantityId: inputs['measurementQuantityId'] || 'AI',
    settlementDate: inputs['settlementDate'] || '',
    hhIndicator: inputs['hhIndicator'] || 'A',
    periods,
  };
}
