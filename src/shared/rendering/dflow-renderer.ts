// ============================================================
// D-Flow Renderer
// Converts typed DFlowFile objects → pipe-delimited .usr strings
//
// ZHV  format: ZHV|{fileId}|{xRef}|{fromRoleCode}|{fromParticipantId}|{toRoleCode}|{toParticipantId}|{YYYYMMDDHHMMSS}||||{testFlag}|
// ZPT  format: ZPT|{fileId}|{linesBetween}||1|{datetime}|    (batch trailer — D0260)
// ZTT  format: ZTT|{fileId}|{totalCount00000000}|{datetime}  (file trailer  — D0010 etc.)
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
    env.fileId,
    env.xRef,
    env.fromRoleCode,
    env.fromParticipantId,
    env.toRoleCode,
    env.toParticipantId,
    env.creationDateTime,
    '',
    '',
    '',
    env.testFlag,
    '',
  ]);
}

function renderRecord(record: DFlowRecord): string {
  return pipe([record.recordType, ...record.fields, '']);
}

// ZPT — batch trailer: count = lines between ZHV and ZPT (body records only)
function renderZPT(env: DFlowEnvelope, linesBetween: number): string {
  return pipe([
    'ZPT',
    env.fileId,
    String(linesBetween),
    '',
    '1',
    env.creationDateTime,
    '',
  ]);
}

// ZTT — file trailer: count = ALL records in file (ZHV + body + ZTT), zero-padded to 8 digits
function renderZTT(env: DFlowEnvelope, totalCount: number): string {
  return pipe(['ZTT', env.fileId, String(totalCount).padStart(8, '0'), env.creationDateTime, '']);
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

// Generate a base file identifier — a 4-5 digit number derived from the current epoch second.
// Each file in a batch offsets from this base so IDs are sequential within a run.
export function generateFileIdBase(): number {
  return Math.floor(Date.now() / 1000) % 90000 + 10000;
}
