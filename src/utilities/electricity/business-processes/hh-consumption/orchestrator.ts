// HH Consumption Data — Process Orchestrator
// Generates a single D0036 file (DC → Supplier)

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { HHConsumptionModel } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';
import { buildD0036 } from '../../dflows/d0036';

export function orchestrateHHConsumption(m: HHConsumptionModel): GeneratedOutput {
  const hhmmss = currentHHMMSS();
  const fileIdBase = generateFileIdBase();

  const envelope: DFlowEnvelope = {
    fileId: String(fileIdBase),
    xRef: makeXRef('D0036', '001'),
    fromRoleCode: m.dcRoleCode,
    fromParticipantId: m.dcParticipantId,
    toRoleCode: m.supplierRoleCode,
    toParticipantId: m.supplierParticipantId,
    creationDateTime: makeDateTime(m.fileDate, hhmmss),
    testFlag: m.testFlag,
    dataFlowId: 'D0036',
  };

  const d0036 = buildD0036({
    envelope,
    mpan: m.mpan,
    measurementQuantityId: m.measurementQuantityId,
    supplierParticipantId: m.supplierParticipantId,
    settlements: [{
      settlementDate: m.settlementDate,
      periods: m.periods.map(consumption => ({ indicator: m.hhIndicator, consumption })),
    }],
  });

  return {
    processId: 'hh-consumption',
    processLabel: 'HH Consumption Data (D0036)',
    dflows: [d0036],
    cssMessages: [],
  };
}
