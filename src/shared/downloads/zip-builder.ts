// ============================================================
// File Output — two strategies:
//   1. saveToDirectory  (File System Access API) — writes files
//      directly to a user-picked folder, no browser download,
//      no Zone.Identifier mark → no Windows security warning.
//   2. buildAndDownloadZip (fallback) — classic blob download.
// ============================================================

import JSZip from 'jszip';
import type { GeneratedOutput } from '../domain/types';
import { renderDFlowFile } from '../rendering/dflow-renderer';

// Minimal File System Access API types (not yet in TypeScript's DOM lib)
interface FSAWritable { write(data: string): Promise<void>; close(): Promise<void>; }
interface FSAFileHandle { createWritable(): Promise<FSAWritable>; }
interface FSADirHandle {
  getDirectoryHandle(name: string, opts?: { create?: boolean }): Promise<FSADirHandle>;
  getFileHandle(name: string, opts?: { create?: boolean }): Promise<FSAFileHandle>;
}
declare global {
  interface Window {
    showDirectoryPicker(opts?: { mode?: 'read' | 'readwrite'; startIn?: string }): Promise<FSADirHandle>;
  }
}

// ---- Strategy 1: File System Access API ----

export function supportsFileSystemAccess(): boolean {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

export async function saveToDirectory(output: GeneratedOutput, inputsJson: unknown): Promise<string[]> {
  const dirHandle = await window.showDirectoryPicker({ mode: 'readwrite', startIn: 'downloads' });
  const saved: string[] = [];

  const processDir = await dirHandle.getDirectoryHandle(sanitiseName(output.processLabel), { create: true });

  const dflowsDir = await processDir.getDirectoryHandle('dflows', { create: true });
  for (const dflow of output.dflows) {
    const fh = await dflowsDir.getFileHandle(dflow.fileName, { create: true });
    const writable = await fh.createWritable();
    await writable.write(renderDFlowFile(dflow));
    await writable.close();
    saved.push(`${output.processLabel}/dflows/${dflow.fileName}`);
  }

  if (output.cssMessages.length > 0) {
    const cssDir = await processDir.getDirectoryHandle('css', { create: true });
    for (const cssMsg of output.cssMessages) {
      const fh = await cssDir.getFileHandle(cssMsg.fileName, { create: true });
      const writable = await fh.createWritable();
      await writable.write(JSON.stringify(cssMsg.content, null, 2));
      await writable.close();
      saved.push(`${output.processLabel}/css/${cssMsg.fileName}`);
    }
  }

  const inputFileName = `${output.processId}_input.json`;
  const inputsFh = await processDir.getFileHandle(inputFileName, { create: true });
  const inputsWritable = await inputsFh.createWritable();
  await inputsWritable.write(JSON.stringify(inputsJson, null, 2));
  await inputsWritable.close();
  saved.push(`${output.processLabel}/${inputFileName}`);

  return saved;
}

// ---- Strategy 2: ZIP blob download (fallback) ----

export async function buildAndDownloadZip(
  output: GeneratedOutput,
  dateStamp: string,
  inputsJson: unknown
): Promise<void> {
  const zip = new JSZip();
  const now = new Date();

  const dflowsFolder = zip.folder('dflows');
  for (const dflow of output.dflows) {
    dflowsFolder!.file(dflow.fileName, renderDFlowFile(dflow), { date: now });
  }

  if (output.cssMessages.length > 0) {
    const cssFolder = zip.folder('css')!;
    for (const cssMsg of output.cssMessages) {
      cssFolder.file(cssMsg.fileName, JSON.stringify(cssMsg.content, null, 2), { date: now });
    }
  }

  zip.file(`${output.processId}_input.json`, JSON.stringify(inputsJson, null, 2), { date: now });

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerDownload(blob, `${sanitiseName(output.processLabel)}_${dateStamp}.zip`);
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function downloadJSONFile(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, filename);
}

function sanitiseName(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '-').trim();
}

export function buildFileSummary(output: GeneratedOutput): string[] {
  const summary: string[] = [];
  for (const df of output.dflows) summary.push(`dflows/${df.fileName}`);
  for (const css of output.cssMessages) summary.push(`css/${css.fileName}`);
  return summary;
}
