// ============================================================
// Form Renderer — builds dynamic HTML form from FormGroupDefinition[]
// ============================================================

import type { FormGroupDefinition, FormFieldDefinition } from '../../shared/domain/types';

export interface ImportResult {
  matched: number;
  missing: Array<{ id: string; label: string }>;
  extra: string[];
}


export function renderFormGroups(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): void {
  container.innerHTML = '';
  for (const group of groups) {
    container.appendChild(group.repeatable ? buildRepeatableGroupCard(group) : buildGroupCard(group));
  }
  wirePlaceholderSync(container, groups);
}

function wirePlaceholderSync(container: HTMLElement, groups: FormGroupDefinition[]): void {
  for (const field of groups.flatMap(g => g.fields)) {
    if (!field.syncFrom) continue;
    const srcEl = container.querySelector<HTMLInputElement>(`#field-${field.syncFrom}`);
    const tgtEl = container.querySelector<HTMLInputElement>(`#field-${field.id}`);
    if (!srcEl || !tgtEl) continue;
    const refresh = () => {
      tgtEl.placeholder = srcEl.value ? `${srcEl.value}  (defaults to COS Date)` : 'YYYY-MM-DD';
    };
    srcEl.addEventListener('change', refresh);
    refresh();
  }
}

function buildGroupCard(group: FormGroupDefinition): HTMLElement {
  const card = document.createElement('div');
  card.className = 'form-group-card';
  card.dataset.groupId = group.id;

  const header = document.createElement('div');
  header.className = 'form-group-header';
  header.innerHTML = `<span class="group-icon">${group.icon}</span>${group.label}`;
  card.appendChild(header);

  const body = document.createElement('div');
  body.className = 'form-group-body';
  for (const field of group.fields) {
    body.appendChild(buildField(field));
  }
  card.appendChild(body);

  return card;
}

// ---- Repeatable group (e.g. register-readings) ----

function buildRepeatableGroupCard(group: FormGroupDefinition): HTMLElement {
  const card = document.createElement('div');
  card.className = 'form-group-card';
  card.dataset.groupId = group.id;

  const header = document.createElement('div');
  header.className = 'form-group-header';
  header.innerHTML = `<span class="group-icon">${group.icon}</span>${group.label}`;

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn-add-register';
  addBtn.textContent = '+ Add Another Register';
  header.appendChild(addBtn);
  card.appendChild(header);

  const body = document.createElement('div');
  body.className = 'form-group-body repeatable-group-body';
  card.appendChild(body);

  body.appendChild(buildRegisterBlock(group, 0));
  updateRemoveButtons(body);

  addBtn.addEventListener('click', () => {
    const idx = body.querySelectorAll('.register-block').length;
    body.appendChild(buildRegisterBlock(group, idx));
    updateRemoveButtons(body);
    body.querySelector<HTMLElement>('.register-block:last-child [data-field-id]')?.focus();
  });

  return card;
}

function buildRegisterBlock(group: FormGroupDefinition, index: number): HTMLElement {
  const block = document.createElement('div');
  block.className = 'register-block';
  block.dataset.registerIndex = String(index);

  const blockHeader = document.createElement('div');
  blockHeader.className = 'register-block-header';

  const label = document.createElement('span');
  label.className = 'register-block-label';
  label.textContent = `Register ${index + 1}`;
  blockHeader.appendChild(label);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-register';
  removeBtn.textContent = '✕ Remove';
  removeBtn.addEventListener('click', () => {
    const parentBody = block.closest<HTMLElement>('.repeatable-group-body')!;
    block.remove();
    reindexRegisterBlocks(parentBody);
    updateRemoveButtons(parentBody);
  });
  blockHeader.appendChild(removeBtn);
  block.appendChild(blockHeader);

  const fieldsGrid = document.createElement('div');
  fieldsGrid.className = 'register-block-fields';
  for (const field of group.fields) {
    fieldsGrid.appendChild(buildField(field, index));
  }
  block.appendChild(fieldsGrid);

  return block;
}

function reindexRegisterBlocks(body: HTMLElement): void {
  body.querySelectorAll<HTMLElement>('.register-block').forEach((block, i) => {
    block.dataset.registerIndex = String(i);

    const labelEl = block.querySelector<HTMLElement>('.register-block-label');
    if (labelEl) labelEl.textContent = `Register ${i + 1}`;

    block.querySelectorAll<HTMLElement>('[data-field-id]').forEach(el => {
      const fieldId = el.dataset.fieldId!;
      el.id = `field-${fieldId}_${i}`;
    });

    block.querySelectorAll<HTMLLabelElement>('label.field-label').forEach(lbl => {
      const m = lbl.htmlFor.match(/^field-(.+)_\d+$/);
      if (m) lbl.htmlFor = `field-${m[1]}_${i}`;
    });
  });
}

function updateRemoveButtons(body: HTMLElement): void {
  const blocks = body.querySelectorAll<HTMLElement>('.register-block');
  blocks.forEach((block, i) => {
    const btn = block.querySelector<HTMLButtonElement>('.btn-remove-register');
    if (btn) btn.style.display = i === 0 && blocks.length === 1 ? 'none' : '';
  });
}

// ---- Field builder ----

function buildField(field: FormFieldDefinition, registerIndex?: number): HTMLElement {
  if (field.type === 'heading') {
    const heading = document.createElement('div');
    heading.className = 'field-section-heading';
    heading.textContent = field.label;
    return heading;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper';

  const fieldId = registerIndex !== undefined
    ? `field-${field.id}_${registerIndex}`
    : `field-${field.id}`;

  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = fieldId;
  label.innerHTML = field.label;
  if (field.required) {
    label.innerHTML += ' <span class="field-required">*</span>';
  }
  wrapper.appendChild(label);

  if (field.type === 'select' && field.options) {
    const select = document.createElement('select');
    select.id = fieldId;
    select.name = field.id;
    select.className = 'field-select';
    if (registerIndex !== undefined) select.dataset.fieldId = field.id;
    if (!field.defaultValue) {
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = '— select —';
      placeholder.selected = true;
      select.appendChild(placeholder);
    }
    for (const opt of field.options) {
      const option = document.createElement('option');
      option.value = opt.value;
      option.textContent = opt.label;
      if (field.defaultValue && opt.value === field.defaultValue) {
        option.selected = true;
      }
      select.appendChild(option);
    }

    const syncSelectClass = () =>
      select.classList.toggle('select-empty', select.value === '');
    syncSelectClass();
    select.addEventListener('change', syncSelectClass);

    wrapper.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.id = fieldId;
    input.name = field.id;
    input.className = 'field-input';
    input.type = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text';
    if (registerIndex !== undefined) input.dataset.fieldId = field.id;
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    if (field.required) input.required = true;
    if (field.readOnly) {
      input.readOnly = true;
      input.classList.add('field-readonly');
    }

    if (field.type === 'date') {
      if (field.defaultValue) input.value = field.defaultValue;
      const syncDateClass = () =>
        input.classList.toggle('date-empty', !input.value);
      syncDateClass();
      input.addEventListener('change', syncDateClass);
    } else {
      if (field.defaultValue) input.value = field.defaultValue;
    }

    wrapper.appendChild(input);
  }

  return wrapper;
}

// ---- Collect values ----

export function collectFormValuesGrouped(
  container: HTMLElement,
  groups: FormGroupDefinition[],
  processLabel: string
): Record<string, unknown> {
  const result: Record<string, unknown> = {
    process: processLabel,
    exportedAt: new Date().toISOString(),
  };
  for (const group of groups) {
    if (group.repeatable) {
      const card = container.querySelector<HTMLElement>(`[data-group-id="${group.id}"]`);
      const blocks = card ? card.querySelectorAll<HTMLElement>('.register-block') : [];
      const arr: Record<string, string>[] = [];
      blocks.forEach(block => {
        const blockValues: Record<string, string> = {};
        for (const field of group.fields) {
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-field-id="${field.id}"]`);
          if (el) blockValues[field.id] = el.value.trim();
        }
        arr.push(blockValues);
      });
      result[group.label] = arr;
    } else {
      const groupValues: Record<string, string> = {};
      for (const field of group.fields) {
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (el) groupValues[field.id] = el.value.trim();
      }
      result[group.label] = groupValues;
    }
  }
  return result;
}

export function collectFormValues(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const group of groups) {
    if (group.repeatable) {
      const card = container.querySelector<HTMLElement>(`[data-group-id="${group.id}"]`);
      const blocks = card ? card.querySelectorAll<HTMLElement>('.register-block') : [];
      blocks.forEach((block, i) => {
        for (const field of group.fields) {
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-field-id="${field.id}"]`);
          if (el) {
            let value = el.value.trim();
            if (field.type === 'date' && value) value = value.replace(/-/g, '');
            values[`${field.id}_${i}`] = value;
          }
        }
      });
    } else {
      for (const field of group.fields) {
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (el) {
          let value = el.value.trim();
          if (field.type === 'date' && value) {
            value = value.replace(/-/g, '');
          }
          values[field.id] = value;
        }
      }
    }
  }
  return values;
}

const IMPORT_METADATA_KEYS = new Set(['process', 'exportedAt']);

export function populateFormFromData(
  container: HTMLElement,
  groups: FormGroupDefinition[],
  data: Record<string, unknown>
): ImportResult {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (IMPORT_METADATA_KEYS.has(key)) continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      for (const [fieldId, fieldValue] of Object.entries(value as Record<string, unknown>)) {
        if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
          flat[fieldId] = String(fieldValue);
        }
      }
    } else if (typeof value === 'string' || typeof value === 'number') {
      flat[key] = String(value);
    }
  }

  let matched = 0;
  const missing: Array<{ id: string; label: string }> = [];
  const formFieldIdSet = new Set(groups.flatMap(g => g.fields.map(f => f.id)));

  for (const group of groups) {
    if (group.repeatable) {
      const card = container.querySelector<HTMLElement>(`[data-group-id="${group.id}"]`);
      const body = card?.querySelector<HTMLElement>('.repeatable-group-body');
      if (!card || !body) continue;

      const groupArrayData = data[group.label];
      const registers: Record<string, string>[] = [];

      const toReg = (entry: unknown): Record<string, string> | null => {
        if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) return null;
        const reg: Record<string, string> = {};
        for (const [k, v] of Object.entries(entry as Record<string, unknown>)) {
          if (typeof v === 'string' || typeof v === 'number') reg[k] = String(v);
        }
        return reg;
      };

      if (Array.isArray(groupArrayData)) {
        for (const entry of groupArrayData) {
          const reg = toReg(entry);
          if (reg) registers.push(reg);
        }
      } else {
        // Legacy single-register object format — treat as one register
        const reg = toReg(groupArrayData);
        if (reg) registers.push(reg);
      }

      const targetCount = Math.max(registers.length, 1);
      while (body.querySelectorAll('.register-block').length < targetCount) {
        const idx = body.querySelectorAll('.register-block').length;
        body.appendChild(buildRegisterBlock(group, idx));
      }
      while (body.querySelectorAll('.register-block').length > targetCount && body.querySelectorAll('.register-block').length > 1) {
        body.querySelector<HTMLElement>('.register-block:last-child')?.remove();
      }
      reindexRegisterBlocks(body);
      updateRemoveButtons(body);

      body.querySelectorAll<HTMLElement>('.register-block').forEach((block, i) => {
        const regData = registers[i] ?? {};
        for (const field of group.fields) {
          if (field.readOnly) continue;
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-field-id="${field.id}"]`);
          if (!el) continue;
          if (field.id in regData) {
            el.value = normaliseDateValue(regData[field.id], field.type);
            syncFieldClass(el, field.type);
            el.classList.remove('invalid');
            matched++;
          } else {
            el.value = field.defaultValue ?? '';
            syncFieldClass(el, field.type);
            if (field.required) missing.push({ id: field.id, label: `${field.label} (Register ${i + 1})` });
          }
        }
      });
    } else {
      for (const field of group.fields) {
        if (field.readOnly) continue;
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (!el) continue;
        el.value = field.defaultValue ?? '';
        syncFieldClass(el, field.type);
      }
      for (const field of group.fields) {
        if (field.readOnly) continue;
        if (field.id in flat) {
          const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
          if (el) {
            el.value = normaliseDateValue(flat[field.id], field.type);
            syncFieldClass(el, field.type);
            el.classList.remove('invalid');
            matched++;
          }
        } else if (field.required) {
          missing.push({ id: field.id, label: field.label });
        }
      }
    }
  }

  const extra = Object.keys(flat).filter(k => !formFieldIdSet.has(k));
  return { matched, missing, extra };
}

export function validateForm(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): string[] {
  const errors: string[] = [];
  let firstInvalid: HTMLElement | null = null;

  for (const group of groups) {
    if (group.repeatable) {
      const card = container.querySelector<HTMLElement>(`[data-group-id="${group.id}"]`);
      const blocks = card ? card.querySelectorAll<HTMLElement>('.register-block') : [];
      const showIndex = blocks.length > 1;
      blocks.forEach((block, i) => {
        for (const field of group.fields) {
          if (!field.required) continue;
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-field-id="${field.id}"]`);
          if (!el || !el.value.trim()) {
            const label = showIndex ? `${field.label} (Register ${i + 1})` : field.label;
            errors.push(`${label} is required`);
            el?.classList.add('invalid');
            if (!firstInvalid && el) firstInvalid = el as HTMLElement;
          } else {
            el?.classList.remove('invalid');
          }
        }
      });
    } else {
      for (const field of group.fields) {
        if (!field.required) continue;
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (!el || !el.value.trim()) {
          errors.push(`${field.label} is required`);
          el?.classList.add('invalid');
          if (!firstInvalid && el) firstInvalid = el as HTMLElement;
        } else {
          el?.classList.remove('invalid');
        }
      }
    }
  }

  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (firstInvalid as HTMLElement).focus();
  }

  return errors;
}

function normaliseDateValue(value: string, type: string): string {
  if (type === 'date' && /^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
}

function syncFieldClass(el: HTMLInputElement | HTMLSelectElement, type: string): void {
  if (el instanceof HTMLSelectElement) {
    el.classList.toggle('select-empty', el.value === '');
  } else if (type === 'date') {
    el.classList.toggle('date-empty', !el.value);
  }
}
