// Standalone HH Consumption (D0036) — Domain Model

import type { TestFlag } from '../../../../shared/domain/types';

export interface HHD0036MQIDBlock {
  measurementQuantityId: string;
  periods: Array<{ indicator: string; consumption: string }>;
}

export interface HHD0036Model {
  testFlag: TestFlag;
  fileDate: string;
  dcRoleCode: string;
  dcParticipantId: string;
  supplierRoleCode: string;
  supplierParticipantId: string;
  mpan: string;
  hhStartDate: string;
  hhEndDate: string;
  hhMQIDBlocks: HHD0036MQIDBlock[];
}

function extractMQIDBlocks(inputs: Record<string, string>): HHD0036MQIDBlock[] {
  const blocks: HHD0036MQIDBlock[] = [];
  let i = 0;
  while (`hhMeasurementQuantityId_${i}` in inputs) {
    const periods: Array<{ indicator: string; consumption: string }> = [];
    for (let p = 1; p <= 48; p++) {
      const idx = String(p).padStart(2, '0');
      periods.push({
        indicator:   inputs[`p${idx}Ind_${i}`] || 'A',
        consumption: inputs[`p${idx}Val_${i}`] ?? '',
      });
    }
    blocks.push({
      measurementQuantityId: inputs[`hhMeasurementQuantityId_${i}`] || 'AI',
      periods,
    });
    i++;
  }
  if (blocks.length === 0) {
    blocks.push({
      measurementQuantityId: 'AI',
      periods: Array.from({ length: 48 }, () => ({ indicator: 'A', consumption: '' })),
    });
  }
  return blocks;
}

export function mapFormToHHD0036Model(inputs: Record<string, string>): HHD0036Model {
  return {
    testFlag:              (inputs['testFlag'] as TestFlag) || 'OPER',
    fileDate:              inputs['fileDate']              || '',
    dcRoleCode:            inputs['dcRoleCode']            || 'C',
    dcParticipantId:       inputs['dcParticipantId']       || '',
    supplierRoleCode:      inputs['supplierRoleCode']      || 'X',
    supplierParticipantId: inputs['supplierParticipantId'] || 'GMTR',
    mpan:                  inputs['mpan']                  || '',
    hhStartDate:           inputs['hhStartDate']           || '',
    hhEndDate:             inputs['hhEndDate']             || '',
    hhMQIDBlocks:          extractMQIDBlocks(inputs),
  };
}
