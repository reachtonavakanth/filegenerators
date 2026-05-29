// ============================================================
// App — main UI controller
// ============================================================

import type { ProcessDefinition, GeneratedOutput } from '../shared/domain/types';
import type { UtilityDefinition } from '../shared/domain/types';
import { allUtilities } from '../utilities';
import { renderFormGroups, collectFormValues, validateForm } from './forms/form-renderer';
import { buildAndDownloadZip, saveToDirectory, supportsFileSystemAccess } from '../shared/downloads/zip-builder';

let selectedProcess: ProcessDefinition | null = null;
let lastOutput: GeneratedOutput | null = null;

export function initApp(): void {
  renderUtilitySelector();
  wireButtons();
}

// ---- Utility Selector ----

function renderUtilitySelector(): void {
  const container = document.getElementById('utility-selector')!;
  container.innerHTML = '';

  for (const utility of allUtilities.filter(u => !u.comingSoon)) {
    const btn = document.createElement('button');
    btn.className = `selector-btn utility-${utility.id}${utility.comingSoon ? ' coming-soon' : ''}`;
    btn.dataset.utilityId = utility.id;

    btn.innerHTML = `
      <span class="btn-icon">${utility.icon}</span>
      <span>
        ${utility.label}
        <span class="btn-sub">${utility.description}</span>
      </span>
      ${utility.comingSoon ? '<span class="coming-soon-tag">Coming Soon</span>' : ''}
    `;

    if (!utility.comingSoon) {
      btn.addEventListener('click', () => selectUtility(utility));
    }

    container.appendChild(btn);
  }
}

function selectUtility(utility: UtilityDefinition): void {
  selectedProcess = null;
  lastOutput = null;

  // Update button states
  document.querySelectorAll('#utility-selector .selector-btn').forEach((b) => {
    b.classList.remove('active');
    if ((b as HTMLElement).dataset.utilityId === utility.id) {
      b.classList.add('active');
    }
  });

  renderProcessSelector(utility);
  hideForm();
}

// ---- Process Selector ----

function renderProcessSelector(utility: UtilityDefinition): void {
  const panel = document.getElementById('process-panel')!;
  const container = document.getElementById('process-selector')!;
  container.innerHTML = '';

  for (const process of utility.processes) {
    const btn = document.createElement('button');
    btn.className = 'selector-btn';
    btn.dataset.processId = process.id;
    btn.innerHTML = `
      <span class="btn-icon">📄</span>
      <span>
        ${process.label}
      </span>
    `;
    btn.addEventListener('click', () => selectProcess(process));
    container.appendChild(btn);
  }

  panel.style.display = 'block';
}

function selectProcess(process: ProcessDefinition): void {
  selectedProcess = process;
  lastOutput = null;

  document.querySelectorAll('#process-selector .selector-btn').forEach((b) => {
    b.classList.remove('active');
    if ((b as HTMLElement).dataset.processId === process.id) {
      b.classList.add('active');
    }
  });

  showForm(process);
  setButtonStates(true, false);
  hideStatus();
}

// ---- Form ----

function showForm(process: ProcessDefinition): void {
  const placeholder = document.getElementById('form-placeholder')!;
  const formArea = document.getElementById('form-area')!;

  placeholder.style.display = 'none';
  formArea.style.display = 'block';

  (document.getElementById('form-title') as HTMLElement).textContent = process.label;
  (document.getElementById('form-description') as HTMLElement).textContent = process.description;

  renderFormGroups(document.getElementById('form-body')!, process.formGroups);
}

function hideForm(): void {
  document.getElementById('form-placeholder')!.style.display = 'flex';
  document.getElementById('form-area')!.style.display = 'none';
}

// ---- Generate ----

function handleGenerate(): void {
  if (!selectedProcess) return;

  const formBody = document.getElementById('form-body')!;
  const errors = validateForm(formBody, selectedProcess.formGroups);

  if (errors.length > 0) {
    showStatus('error', `Please fill required fields: ${errors.slice(0, 3).join(', ')}${errors.length > 3 ? ` (+${errors.length - 3} more)` : ''}`);
    return;
  }

  const inputs = collectFormValues(formBody, selectedProcess.formGroups);

  try {
    lastOutput = selectedProcess.generate(inputs);
    setButtonStates(true, true);
    showStatus(
      'success',
      `Generated ${lastOutput.dflows.length} D-flow file(s) and ${lastOutput.cssMessages.length} CSS message(s). Click Save Files to export.`
    );
  } catch (err) {
    showStatus('error', `Generation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// ---- Download ----

async function handleDownload(): Promise<void> {
  if (!lastOutput) return;
  try {
    if (supportsFileSystemAccess()) {
      // Writes directly to chosen folder — no Zone.Identifier mark, no Windows warning
      const saved = await saveToDirectory(lastOutput);
      showStatus('success', `Saved ${saved.length} file(s) to selected folder.`);
    } else {
      // Fallback: ZIP blob download (Firefox / older browsers)
      const dateStamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
      await buildAndDownloadZip(lastOutput, dateStamp);
      showStatus('info', `ZIP downloaded: ${lastOutput.processId}_${dateStamp}.zip`);
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return; // user cancelled picker
    showStatus('error', `Save failed: ${err instanceof Error ? err.message : String(err)}`);
  }
}


// ---- Status ----

function showStatus(type: 'success' | 'error' | 'info', message: string): void {
  const bar = document.getElementById('status-bar')!;
  const icon = document.getElementById('status-icon')!;
  const text = document.getElementById('status-text')!;

  bar.className = `status-bar ${type}`;
  icon.textContent = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  text.textContent = message;
  bar.style.display = 'flex';
}

function hideStatus(): void {
  document.getElementById('status-bar')!.style.display = 'none';
}

// ---- Button states ----

function setButtonStates(generateEnabled: boolean, downloadEnabled: boolean): void {
  const btnGenerate = document.getElementById('btn-generate') as HTMLButtonElement;
  const btnDownload = document.getElementById('btn-download') as HTMLButtonElement;
  btnGenerate.disabled = !generateEnabled;
  btnDownload.disabled = !downloadEnabled;
}

function wireButtons(): void {
  document.getElementById('btn-generate')!.addEventListener('click', handleGenerate);
  document.getElementById('btn-download')!.addEventListener('click', () => {
    handleDownload().catch(console.error);
  });
}
