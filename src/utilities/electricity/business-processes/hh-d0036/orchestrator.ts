// Standalone HH Consumption (D0036) — Process Orchestrator
// Generates one D0036 .usr file per settlement date in the range.
// No CSS messages — pure D-flow output.

import type { GeneratedOutput, DFlowEnvelope } from '../../../../shared/domain/types';
import type { HHD0036Model } from './model';
import { makeDateTime, makeXRef, currentHHMMSS, generateFileIdBase } from '../../../../shared/rendering/dflow-renderer';
import { buildD0036 } from '../../dflows/d0036';

function scaleConsumption(
  periods: Array<{ indicator: string; consumption: string }>,
  factor: number
): Array<{ indicator: string; consumption: string }> {
  return periods.map(p => ({
    indicator: p.indicator,
    consumption: p.consumption.trim()
      ? (parseFloat(p.consumption) * factor).toFixed(1)
      : '',
  }));
}

function expandDateRange(startYMD: string, endYMD: string): string[] {
  if (startYMD.length !== 8 || endYMD.length !== 8) return [];
  const dates: string[] = [];
  const cur = new Date(+startYMD.slice(0, 4), +startYMD.slice(4, 6) - 1, +startYMD.slice(6, 8));
  const end = new Date(+endYMD.slice(0, 4), +endYMD.slice(4, 6) - 1, +endYMD.slice(6, 8));
  while (cur <= end) {
    const y = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, '0');
    const dy = String(cur.getDate()).padStart(2, '0');
    dates.push(`${y}${mo}${dy}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function orchestrateHHD0036(m: HHD0036Model): GeneratedOutput {
  const hhmmss = currentHHMMSS();
  const fileIdBase = generateFileIdBase();
  if (m.hhStartDate > m.hhEndDate) throw new Error(`Start Date (${m.hhStartDate}) is after End Date (${m.hhEndDate})`);
  const dates = expandDateRange(m.hhStartDate, m.hhEndDate);

  const d0036Files = dates.map((date, i) => {
    const envelope: DFlowEnvelope = {
      fileId:             String(fileIdBase + i),
      xRef:               makeXRef('D0036', '001'),
      fromRoleCode:       m.dcRoleCode,
      fromParticipantId:  m.dcParticipantId,
      toRoleCode:         m.supplierRoleCode,
      toParticipantId:    m.supplierParticipantId,
      creationDateTime:   makeDateTime(m.fileDate, hhmmss),
      testFlag:           m.testFlag,
      dataFlowId:         'D0036',
    };
    const file = buildD0036({
      envelope,
      mpan:                  m.mpan,
      supplierParticipantId: m.supplierParticipantId,
      mqidBlocks: m.hhMQIDBlocks.map(block => ({
        measurementQuantityId: block.measurementQuantityId,
        settlements: [{
          settlementDate: date,
          periods: i % 2 === 0 ? block.periods : scaleConsumption(block.periods, m.hhLowDayFactor),
        }],
      })),
    });
    file.fileName = `D0036_${date}.usr`;
    return file;
  });

  const warnings: string[] = [];
  for (const block of m.hhMQIDBlocks) {
    const filled = block.periods.filter(p => p.consumption.trim() !== '').length;
    if (filled < 48) {
      warnings.push(`${block.measurementQuantityId}: ${filled} of 48 intervals filled (${48 - filled} missing) — applied to all ${dates.length} days`);
    }
  }

  return {
    processId:    'hh-d0036',
    processLabel: 'HH Consumption (D0036)',
    folderName:   `${m.mpan}_HH_D0036`,
    dflows:       d0036Files,
    cssMessages:  [],
    warnings:     warnings.length > 0 ? warnings : undefined,
  };
}
