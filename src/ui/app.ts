// ============================================================
// App — main UI controller
// ============================================================

import type { ProcessDefinition, GeneratedOutput } from '../shared/domain/types';
import type { UtilityDefinition } from '../shared/domain/types';
import { allUtilities } from '../utilities';
import { renderFormGroups, collectFormValues, collectFormValuesGrouped, validateForm } from './forms/form-renderer';
import { buildAndDownloadZip, saveToDirectory, supportsFileSystemAccess, downloadJSONFile } from '../shared/downloads/zip-builder';

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

  // Search input — create once, reuse on utility switch
  let searchInput = document.getElementById('process-search') as HTMLInputElement | null;
  if (!searchInput) {
    const wrapper = document.createElement('div');
    wrapper.className = 'process-search-wrapper';
    searchInput = document.createElement('input');
    searchInput.id = 'process-search';
    searchInput.type = 'text';
    searchInput.className = 'process-search-input';
    searchInput.placeholder = '🔍 Search processes…';
    wrapper.appendChild(searchInput);
    panel.insertBefore(wrapper, container);
  }
  searchInput.value = '';

  // Build list items
  for (const process of utility.processes) {
    const btn = document.createElement('button');
    btn.className = 'selector-btn';
    btn.dataset.processId = process.id;
    btn.dataset.searchText = process.label.toLowerCase();
    btn.innerHTML = `
      <span class="btn-icon">📄</span>
      <span>${process.label}</span>
    `;
    btn.addEventListener('click', () => selectProcess(process));
    container.appendChild(btn);
  }

  // No-results placeholder
  const noResults = document.createElement('p');
  noResults.id = 'process-no-results';
  noResults.className = 'process-no-results';
  noResults.textContent = 'No matching processes';
  noResults.style.display = 'none';
  container.appendChild(noResults);

  // Live filter
  searchInput.oninput = () => {
    const q = (searchInput as HTMLInputElement).value.toLowerCase().trim();
    let visible = 0;
    container.querySelectorAll<HTMLButtonElement>('.selector-btn').forEach(btn => {
      const match = !q || (btn.dataset.searchText ?? '').includes(q);
      btn.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    noResults.style.display = visible === 0 ? 'block' : 'none';
  };

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

// ---- Export JSON ----

function handleExportJSON(): void {
  if (!selectedProcess) return;
  const formBody = document.getElementById('form-body')!;
  const grouped = collectFormValuesGrouped(formBody, selectedProcess.formGroups, selectedProcess.label);
  const filename = `${selectedProcess.label.replace(/[/\\:*?"<>|]/g, '-')}_inputs.json`;
  downloadJSONFile(grouped, filename);
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
  if (!lastOutput || !selectedProcess) return;
  const formBody = document.getElementById('form-body')!;
  const inputsJson = collectFormValuesGrouped(formBody, selectedProcess.formGroups, selectedProcess.label);
  try {
    if (supportsFileSystemAccess()) {
      try {
        const saved = await saveToDirectory(lastOutput, inputsJson);
        showStatus('success', `Saved ${saved.length} file(s) to selected folder.`);
        return;
      } catch (fsErr) {
        if (fsErr instanceof DOMException && fsErr.name === 'AbortError') return;
        // Enterprise policy blocks showDirectoryPicker — fall through to ZIP
        if (!(fsErr instanceof DOMException && (fsErr.name === 'SecurityError' || fsErr.name === 'NotAllowedError'))) {
          throw fsErr;
        }
      }
    }
    // ZIP fallback (Firefox, older browsers, or blocked File System Access API)
    const dateStamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
    await buildAndDownloadZip(lastOutput, dateStamp, inputsJson);
    showStatus('info', `ZIP downloaded: ${lastOutput.processLabel}_${dateStamp}.zip`);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') return;
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
  const btnExportJson = document.getElementById('btn-export-json') as HTMLButtonElement;
  btnGenerate.disabled = !generateEnabled;
  btnDownload.disabled = !downloadEnabled;
  btnExportJson.disabled = !generateEnabled;
}

function wireButtons(): void {
  document.getElementById('btn-generate')!.addEventListener('click', handleGenerate);
  document.getElementById('btn-download')!.addEventListener('click', () => {
    handleDownload().catch(console.error);
  });
  document.getElementById('btn-export-json')!.addEventListener('click', handleExportJSON);
  wireIndustryLookup();
}

// ---- Industry Data Lookup ----

function wireIndustryLookup(): void {
  document.getElementById('industry-lookup-toggle')!.addEventListener('click', () => {
    toggleCollapsible('industry-lookup-body', 'industry-lookup-toggle');
  });

  document.getElementById('industry-response-toggle')!.addEventListener('click', () => {
    toggleCollapsible('industry-response-body', 'industry-response-toggle');
  });

  document.getElementById('industry-config-file')!.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const config = JSON.parse(ev.target?.result as string) as Record<string, unknown>;
        if (typeof config.url === 'string') {
          (document.getElementById('industry-api-url') as HTMLInputElement).value = config.url;
        }
        if (typeof config.authKey === 'string') {
          (document.getElementById('industry-auth-key') as HTMLInputElement).value = config.authKey;
        }
        showStatus('success', `Config loaded from ${file.name}`);
      } catch {
        showStatus('error', 'Failed to parse JSON config file');
      }
    };
    reader.readAsText(file);
  });

  document.getElementById('btn-get-industry-data')!.addEventListener('click', () => {
    handleGetIndustryData().catch(console.error);
  });
}

function toggleCollapsible(bodyId: string, toggleId: string): void {
  const body = document.getElementById(bodyId)!;
  const toggle = document.getElementById(toggleId)!;
  const chevron = toggle.querySelector('.collapsible-chevron') as HTMLElement;
  const isOpen = body.style.display !== 'none';
  body.style.display = isOpen ? 'none' : 'block';
  toggle.setAttribute('aria-expanded', String(!isOpen));
  chevron.textContent = isOpen ? '▼' : '▲';
}

async function handleGetIndustryData(): Promise<void> {
  const url = (document.getElementById('industry-api-url') as HTMLInputElement).value.trim();
  const authKey = (document.getElementById('industry-auth-key') as HTMLInputElement).value.trim();
  const mpan = (document.getElementById('industry-mpan') as HTMLInputElement).value.trim();

  if (!url) { showStatus('error', 'API URL is required'); return; }
  if (!mpan) { showStatus('error', 'MPAN is required'); return; }

  const btn = document.getElementById('btn-get-industry-data') as HTMLButtonElement;
  btn.disabled = true;
  btn.textContent = '⏳ Fetching...';

  try {
    const fullUrl = new URL(url);
    fullUrl.searchParams.set('MPAN', mpan);

    const headers: Record<string, string> = { 'Accept': 'application/json' };
    if (authKey) headers['Authorization'] = authKey;

    const res = await fetch(fullUrl.toString(), { headers });

    let data: unknown;
    const contentType = res.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    const responsePanel = document.getElementById('industry-response-panel')!;
    const responseContent = document.getElementById('industry-response-content')!;
    const responseBody = document.getElementById('industry-response-body')!;
    const responseToggle = document.getElementById('industry-response-toggle')!;
    const chevron = responseToggle.querySelector('.collapsible-chevron') as HTMLElement;

    responsePanel.style.display = 'block';
    responseBody.style.display = 'block';
    responseToggle.setAttribute('aria-expanded', 'true');
    chevron.textContent = '▲';
    responseContent.textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    responsePanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    showStatus(res.ok ? 'success' : 'error', `Industry data: ${res.status} ${res.statusText}`);
  } catch (err) {
    showStatus('error', `Fetch failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    btn.disabled = false;
    btn.textContent = '🔍 Get Industry Data';
  }
}
