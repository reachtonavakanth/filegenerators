// ============================================================
// D-Flow Renderer
// Converts typed DFlowFile objects → pipe-delimited .usr strings
//
// ZHV  format: ZHV|{senderId}|{xRef}|{testFlag}|{recipientId}|{recipientRole}|{senderRole}|{YYYYMMDDHHMMSS}||||OPER|
// ZPT  format: ZPT|{senderId}|{batchCount}||1|{datetime}|          (batch trailer — D0260)
// ZTT  format: ZTT|{senderId}|{totalCount00000000}|{datetime}       (file trailer  — D0010 etc.)
// ============================================================

import type { DFlowFile, DFlowEnvelope, DFlowRecord } from '../domain/types';

export function renderDFlowFile(file: DFlowFile): string {
  const lines: string[] = [];

  lines.push(renderZHV(file.envelope));

  for (const record of file.records) {
    lines.push(renderRecord(record));
  }

  if (file.trailerType === 'ZPT') {
    lines.push(renderZPT(file.envelope, file.records.length));
  } else {
    // ZTT total = ZHV (1) + body records + ZTT (1)
    lines.push(renderZTT(file.envelope, file.records.length + 2));
  }

  return lines.join('\r\n') + '\r\n';
}

function renderZHV(env: DFlowEnvelope): string {
  return pipe([
    'ZHV',
    env.senderId,
    env.xRef,
    env.testFlag,
    env.recipientId,
    env.senderRole,    // field 6 — sender's role (FROM)
    env.recipientRole, // field 7 — recipient's role (TO)
    env.creationDateTime,
    '',       // version
    '',       // priority
    '',
    'OPER',
    '',
  ]);
}

function renderRecord(record: DFlowRecord): string {
  return pipe([record.recordType, ...record.fields, '']);
}

// ZPT — batch trailer: count = records within the batch (incl. 757 header)
function renderZPT(env: DFlowEnvelope, batchCount: number): string {
  return pipe([
    'ZPT',
    env.senderId,
    String(batchCount),
    '',
    '1',
    env.creationDateTime,
    '',
  ]);
}

// ZTT — file trailer: count = ALL records in file (ZHV + body + ZTT), zero-padded to 8 digits
function renderZTT(env: DFlowEnvelope, totalCount: number): string {
  return pipe(['ZTT', env.senderId, String(totalCount).padStart(8, '0'), env.creationDateTime, '']);
}

function pipe(fields: string[]): string {
  return fields.join('|');
}

// ---- Helpers ----

// Combine fileDate (YYYYMMDD) + hhmmss (HHMMSS) → YYYYMMDDHHMMSS
export function makeDateTime(fileDate: string, hhmmss: string): string {
  return fileDate + hhmmss.padEnd(6, '0');
}

// Current time as HHMMSS — called at generation time so each run gets a live timestamp
export function currentHHMMSS(): string {
  const d = new Date();
  return (
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0') +
    String(d.getSeconds()).padStart(2, '0')
  );
}

// Auto-generate xRef: {flowId}{3-digit sequence} e.g. 'D0260001'
export function makeXRef(flowId: string, seq: string): string {
  return `${flowId}${seq.padStart(3, '0')}`;
}
