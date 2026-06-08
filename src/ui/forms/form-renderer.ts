// ============================================================
// Form Renderer — builds dynamic HTML form from FormGroupDefinition[]
// ============================================================

import flatpickr from 'flatpickr';
import 'flatpickr/dist/themes/dark.css';
import type { FormGroupDefinition, FormFieldDefinition, InnerRepeatableDefinition } from '../../shared/domain/types';

const fpInstances = new WeakMap<HTMLInputElement, ReturnType<typeof flatpickr>>();

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

// ---- Repeatable group ----

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
  addBtn.textContent = `+ ${group.addLabel ?? 'Add Another Register'}`;
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
  const blockLabel = group.blockLabel ?? 'Register';
  const block = document.createElement('div');
  block.className = 'register-block';
  block.dataset.registerIndex = String(index);

  const blockHeader = document.createElement('div');
  blockHeader.className = 'register-block-header';

  const label = document.createElement('span');
  label.className = 'register-block-label';
  label.textContent = `${blockLabel} ${index + 1}`;
  blockHeader.appendChild(label);

  if (group.blockAutoFill) {
    const cfg = group.blockAutoFill;
    const autoFillBtn = document.createElement('button');
    autoFillBtn.type = 'button';
    autoFillBtn.className = 'btn-auto-fill';
    autoFillBtn.textContent = cfg.label;
    autoFillBtn.addEventListener('click', () => {
      const fieldsGrid = block.querySelector<HTMLElement>('.register-block-fields');
      if (!fieldsGrid) return;
      for (const fieldId of cfg.fieldIds) {
        const el = fieldsGrid.querySelector<HTMLInputElement>(`[data-field-id="${fieldId}"]`);
        if (el) el.value = (cfg.range.min + Math.random() * (cfg.range.max - cfg.range.min)).toFixed(cfg.range.decimals);
      }
    });
    blockHeader.appendChild(autoFillBtn);
  }

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-register';
  removeBtn.textContent = '✕ Remove';
  removeBtn.addEventListener('click', () => {
    const parentBody = block.closest<HTMLElement>('.repeatable-group-body')!;
    block.remove();
    reindexRegisterBlocks(parentBody, group);
    updateRemoveButtons(parentBody);
  });
  blockHeader.appendChild(removeBtn);
  block.appendChild(blockHeader);

  const fieldsGrid = document.createElement('div');
  fieldsGrid.className = group.blockFieldsClass
    ? `register-block-fields ${group.blockFieldsClass}`
    : 'register-block-fields';
  for (const field of group.fields) {
    fieldsGrid.appendChild(buildField(field, index));
  }
  block.appendChild(fieldsGrid);

  // ---- Inner repeatable (e.g. 04A registers within a 03A meter block) ----
  if (group.innerRepeatable) {
    block.appendChild(buildInnerRepeatableSection(group.innerRepeatable, index));
  }

  return block;
}

function reindexRegisterBlocks(body: HTMLElement, group: FormGroupDefinition): void {
  const blockLabel = group.blockLabel ?? 'Register';
  body.querySelectorAll<HTMLElement>('.register-block').forEach((block, i) => {
    block.dataset.registerIndex = String(i);

    const labelEl = block.querySelector<HTMLElement>(':scope > .register-block-header .register-block-label');
    if (labelEl) labelEl.textContent = `${blockLabel} ${i + 1}`;

    // Reindex outer fields
    block.querySelectorAll<HTMLElement>(':scope > .register-block-fields [data-field-id]').forEach(el => {
      const fieldId = el.dataset.fieldId!;
      el.id = `field-${fieldId}_${i}`;
    });
    block.querySelectorAll<HTMLLabelElement>(':scope > .register-block-fields label.field-label').forEach(lbl => {
      const m = lbl.htmlFor.match(/^field-(.+)_\d+$/);
      if (m) lbl.htmlFor = `field-${m[1]}_${i}`;
    });

    // Reindex inner blocks (update outer index in their IDs)
    if (group.innerRepeatable) {
      block.querySelectorAll<HTMLElement>('.inner-block').forEach((innerBlock, j) => {
        innerBlock.dataset.outerIndex = String(i);
        innerBlock.dataset.innerIndex = String(j);
        innerBlock.querySelectorAll<HTMLElement>('[data-inner-field-id]').forEach(el => {
          const fieldId = el.dataset.innerFieldId!;
          el.id = `field-${fieldId}_${i}_${j}`;
        });
        innerBlock.querySelectorAll<HTMLLabelElement>('label.field-label').forEach(lbl => {
          const m = lbl.htmlFor.match(/^field-(.+)_\d+_\d+$/);
          if (m) lbl.htmlFor = `field-${m[1]}_${i}_${j}`;
        });
      });
    }
  });
}

function updateRemoveButtons(body: HTMLElement): void {
  const blocks = body.querySelectorAll<HTMLElement>(':scope > .register-block');
  blocks.forEach((block, i) => {
    const btn = block.querySelector<HTMLButtonElement>(':scope > .register-block-header .btn-remove-register');
    if (btn) btn.style.display = i === 0 && blocks.length === 1 ? 'none' : '';
  });
}

// ---- Inner repeatable (nested within an outer block) ----

function buildInnerRepeatableSection(inner: InnerRepeatableDefinition, outerIndex: number): HTMLElement {
  const section = document.createElement('div');
  section.className = 'inner-repeatable-section';

  const header = document.createElement('div');
  header.className = 'inner-repeatable-header';

  const title = document.createElement('span');
  title.className = 'inner-repeatable-title';
  title.textContent = inner.label;
  header.appendChild(title);

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'btn-add-inner';
  addBtn.textContent = `+ ${inner.addLabel}`;
  header.appendChild(addBtn);
  section.appendChild(header);

  const innerBody = document.createElement('div');
  innerBody.className = 'inner-repeatable-body';
  section.appendChild(innerBody);

  innerBody.appendChild(buildInnerBlock(inner, outerIndex, 0));
  updateInnerRemoveButtons(innerBody);

  addBtn.addEventListener('click', () => {
    const currentOuter = parseInt(
      addBtn.closest<HTMLElement>('.register-block')?.dataset.registerIndex ?? String(outerIndex)
    );
    const count = innerBody.querySelectorAll('.inner-block').length;
    innerBody.appendChild(buildInnerBlock(inner, currentOuter, count));
    updateInnerRemoveButtons(innerBody);
  });

  return section;
}

function buildInnerBlock(inner: InnerRepeatableDefinition, outerIndex: number, innerIndex: number): HTMLElement {
  const block = document.createElement('div');
  block.className = 'inner-block';
  block.dataset.outerIndex = String(outerIndex);
  block.dataset.innerIndex = String(innerIndex);

  const header = document.createElement('div');
  header.className = 'inner-block-header';

  const label = document.createElement('span');
  label.className = 'inner-block-label';
  label.textContent = `Register ${innerIndex + 1}`;
  header.appendChild(label);

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'btn-remove-inner';
  removeBtn.textContent = '✕ Remove';
  removeBtn.addEventListener('click', () => {
    const parentBody = block.closest<HTMLElement>('.inner-repeatable-body')!;
    const currentOuter = parseInt(
      block.closest<HTMLElement>('.register-block')?.dataset.registerIndex ?? String(outerIndex)
    );
    block.remove();
    reindexInnerBlocks(parentBody, currentOuter);
    updateInnerRemoveButtons(parentBody);
  });
  header.appendChild(removeBtn);
  block.appendChild(header);

  const fieldsGrid = document.createElement('div');
  fieldsGrid.className = 'inner-block-fields';
  for (const field of inner.fields) {
    fieldsGrid.appendChild(buildField(field, outerIndex, innerIndex));
  }
  block.appendChild(fieldsGrid);

  return block;
}

function reindexInnerBlocks(body: HTMLElement, outerIndex: number): void {
  body.querySelectorAll<HTMLElement>('.inner-block').forEach((block, j) => {
    block.dataset.innerIndex = String(j);
    block.dataset.outerIndex = String(outerIndex);

    const labelEl = block.querySelector<HTMLElement>('.inner-block-label');
    if (labelEl) labelEl.textContent = `Register ${j + 1}`;

    block.querySelectorAll<HTMLElement>('[data-inner-field-id]').forEach(el => {
      const fieldId = el.dataset.innerFieldId!;
      el.id = `field-${fieldId}_${outerIndex}_${j}`;
    });
    block.querySelectorAll<HTMLLabelElement>('label.field-label').forEach(lbl => {
      const m = lbl.htmlFor.match(/^field-(.+)_\d+_\d+$/);
      if (m) lbl.htmlFor = `field-${m[1]}_${outerIndex}_${j}`;
    });
  });
}

function updateInnerRemoveButtons(body: HTMLElement): void {
  const blocks = body.querySelectorAll<HTMLElement>('.inner-block');
  blocks.forEach((block, i) => {
    const btn = block.querySelector<HTMLButtonElement>('.btn-remove-inner');
    if (btn) btn.style.display = i === 0 && blocks.length === 1 ? 'none' : '';
  });
}

// ---- Field builder ----

function buildField(field: FormFieldDefinition, outerIndex?: number, innerIndex?: number): HTMLElement {
  if (field.type === 'heading') {
    const heading = document.createElement('div');
    heading.className = 'field-section-heading';
    heading.textContent = field.label;
    return heading;
  }

  if (field.type === 'fill-action') {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-wrapper field-wrapper--action';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn-auto-fill';
    btn.textContent = field.label;
    if (field.fillTargets && field.fillRange) {
      const { fillTargets, fillRange: range } = field;
      btn.addEventListener('click', () => {
        const block = btn.closest('.register-block') ?? btn.closest('.form-group-body');
        if (!block) return;
        for (const targetId of fillTargets) {
          const el = block.querySelector<HTMLInputElement>(`[data-field-id="${targetId}"]`);
          if (el) el.value = (range.min + Math.random() * (range.max - range.min)).toFixed(range.decimals);
        }
      });
    }
    wrapper.appendChild(btn);
    return wrapper;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper';

  const isInner = outerIndex !== undefined && innerIndex !== undefined;
  const isOuter = outerIndex !== undefined && innerIndex === undefined;

  const fieldId = isInner
    ? `field-${field.id}_${outerIndex}_${innerIndex}`
    : isOuter
    ? `field-${field.id}_${outerIndex}`
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
    if (isOuter)  select.dataset.fieldId = field.id;
    if (isInner) { select.dataset.innerFieldId = field.id; select.dataset.outerIndex = String(outerIndex); }
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
      if (field.defaultValue && opt.value === field.defaultValue) option.selected = true;
      select.appendChild(option);
    }
    const syncSelectClass = () => select.classList.toggle('select-empty', select.value === '');
    syncSelectClass();
    select.addEventListener('change', syncSelectClass);
    wrapper.appendChild(select);
  } else {
    const input = document.createElement('input');
    input.id = fieldId;
    input.name = field.id;
    input.className = 'field-input';
    input.type = field.type === 'number' ? 'number' : 'text';
    if (isOuter)  input.dataset.fieldId = field.id;
    if (isInner) { input.dataset.innerFieldId = field.id; input.dataset.outerIndex = String(outerIndex); }
    if (field.placeholder) input.placeholder = field.placeholder;
    if (field.maxLength) input.maxLength = field.maxLength;
    if (field.step) input.step = field.step;
    if (field.required) input.required = true;
    if (field.readOnly) { input.readOnly = true; input.classList.add('field-readonly'); }

    if (field.type === 'date') {
      input.readOnly = true;
      input.classList.toggle('date-empty', !field.defaultValue);
      const fp = flatpickr(input, {
        dateFormat: 'Y-m-d',
        defaultDate: field.defaultValue || undefined,
        allowInput: false,
        onChange: (_d, dateStr) => input.classList.toggle('date-empty', !dateStr),
      });
      fpInstances.set(input, fp);
    } else {
      if (field.defaultValue) input.value = field.defaultValue;
    }
    wrapper.appendChild(input);
  }

  if (field.helpText) {
    const help = document.createElement('span');
    help.className = 'field-help';
    help.textContent = field.helpText;
    wrapper.appendChild(help);
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
      const blocks = card ? card.querySelectorAll<HTMLElement>(':scope > .repeatable-group-body > .register-block') : [];
      const arr: Record<string, unknown>[] = [];
      blocks.forEach((block) => {
        const blockValues: Record<string, unknown> = {};
        for (const field of group.fields) {
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`:scope > .register-block-fields [data-field-id="${field.id}"]`);
          if (el) blockValues[field.id] = el.value.trim();
        }
        if (group.innerRepeatable) {
          const innerBlocks = block.querySelectorAll<HTMLElement>('.inner-block');
          const innerArr: Record<string, string>[] = [];
          innerBlocks.forEach(innerBlock => {
            const innerValues: Record<string, string> = {};
            for (const field of group.innerRepeatable!.fields) {
              const el = innerBlock.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inner-field-id="${field.id}"]`);
              if (el) innerValues[field.id] = el.value.trim();
            }
            innerArr.push(innerValues);
          });
          blockValues[group.innerRepeatable.id] = innerArr;
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
      const blocks = card ? card.querySelectorAll<HTMLElement>(':scope > .repeatable-group-body > .register-block') : [];
      blocks.forEach((block, i) => {
        // Outer (e.g. 03A) fields
        for (const field of group.fields) {
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`:scope > .register-block-fields [data-field-id="${field.id}"]`);
          if (el) {
            let value = el.value.trim();
            if (field.type === 'date' && value) value = value.replace(/-/g, '');
            values[`${field.id}_${i}`] = value;
          }
        }
        // Inner (e.g. 04A) fields
        if (group.innerRepeatable) {
          const innerBlocks = block.querySelectorAll<HTMLElement>('.inner-block');
          innerBlocks.forEach((innerBlock, j) => {
            for (const field of group.innerRepeatable!.fields) {
              const el = innerBlock.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inner-field-id="${field.id}"]`);
              if (el) {
                let value = el.value.trim();
                if (field.type === 'date' && value) value = value.replace(/-/g, '');
                values[`${field.id}_${i}_${j}`] = value;
              }
            }
          });
        }
      });
    } else {
      for (const field of group.fields) {
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (el) {
          let value = el.value.trim();
          if (field.type === 'date' && value) value = value.replace(/-/g, '');
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
      const outerEntries: Record<string, unknown>[] = [];

      const toEntry = (e: unknown): Record<string, unknown> | null => {
        if (e === null || typeof e !== 'object' || Array.isArray(e)) return null;
        return e as Record<string, unknown>;
      };

      if (Array.isArray(groupArrayData)) {
        for (const e of groupArrayData) { const r = toEntry(e); if (r) outerEntries.push(r); }
      } else {
        const r = toEntry(groupArrayData); if (r) outerEntries.push(r);
      }

      const targetCount = Math.max(outerEntries.length, 1);
      while (body.querySelectorAll(':scope > .register-block').length < targetCount) {
        const idx = body.querySelectorAll(':scope > .register-block').length;
        body.appendChild(buildRegisterBlock(group, idx));
      }
      while (body.querySelectorAll(':scope > .register-block').length > targetCount &&
             body.querySelectorAll(':scope > .register-block').length > 1) {
        body.querySelector<HTMLElement>(':scope > .register-block:last-child')?.remove();
      }
      reindexRegisterBlocks(body, group);
      updateRemoveButtons(body);

      body.querySelectorAll<HTMLElement>(':scope > .register-block').forEach((block, i) => {
        const entry = outerEntries[i] ?? {};
        for (const field of group.fields) {
          if (field.readOnly || field.type === 'heading' || field.type === 'fill-action') continue;
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`:scope > .register-block-fields [data-field-id="${field.id}"]`);
          if (!el) continue;
          if (field.id in entry && typeof (entry[field.id]) === 'string') {
            setElValue(el, normaliseDateValue(entry[field.id] as string, field.type), field.type);
            syncFieldClass(el, field.type);
            el.classList.remove('invalid');
            matched++;
          } else {
            setElValue(el, field.defaultValue ?? '', field.type);
            syncFieldClass(el, field.type);
            if (field.required) missing.push({ id: field.id, label: `${field.label} (${group.blockLabel ?? 'Register'} ${i + 1})` });
          }
        }

        if (group.innerRepeatable) {
          const innerKey = group.innerRepeatable.id;
          const innerArray = Array.isArray(entry[innerKey]) ? (entry[innerKey] as unknown[]) : [];
          const innerBody = block.querySelector<HTMLElement>('.inner-repeatable-body');
          if (innerBody) {
            const innerTarget = Math.max(innerArray.length, 1);
            while (innerBody.querySelectorAll('.inner-block').length < innerTarget)
              innerBody.appendChild(buildInnerBlock(group.innerRepeatable, i, innerBody.querySelectorAll('.inner-block').length));
            while (innerBody.querySelectorAll('.inner-block').length > innerTarget &&
                   innerBody.querySelectorAll('.inner-block').length > 1)
              innerBody.querySelector<HTMLElement>('.inner-block:last-child')?.remove();
            reindexInnerBlocks(innerBody, i);
            updateInnerRemoveButtons(innerBody);

            innerBody.querySelectorAll<HTMLElement>('.inner-block').forEach((innerBlock, j) => {
              const innerEntry = (innerArray[j] !== null && typeof innerArray[j] === 'object') ? innerArray[j] as Record<string, unknown> : {};
              for (const field of group.innerRepeatable!.fields) {
                if (field.readOnly || field.type === 'heading' || field.type === 'fill-action') continue;
                const el = innerBlock.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inner-field-id="${field.id}"]`);
                if (!el) continue;
                if (field.id in innerEntry && typeof innerEntry[field.id] === 'string') {
                  setElValue(el, normaliseDateValue(innerEntry[field.id] as string, field.type), field.type);
                  syncFieldClass(el, field.type);
                  el.classList.remove('invalid');
                  matched++;
                } else {
                  setElValue(el, field.defaultValue ?? '', field.type);
                  syncFieldClass(el, field.type);
                }
              }
            });
          }
        }
      });
    } else {
      for (const field of group.fields) {
        if (field.readOnly || field.type === 'heading' || field.type === 'fill-action') continue;
        const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
        if (!el) continue;
        setElValue(el, field.defaultValue ?? '', field.type);
        syncFieldClass(el, field.type);
      }
      for (const field of group.fields) {
        if (field.readOnly || field.type === 'heading' || field.type === 'fill-action') continue;
        if (field.id in flat) {
          const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
          if (el) {
            setElValue(el, normaliseDateValue(flat[field.id], field.type), field.type);
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
      const blocks = card ? card.querySelectorAll<HTMLElement>(':scope > .repeatable-group-body > .register-block') : [];
      const blockLabel = group.blockLabel ?? 'Register';
      const showOuter = blocks.length > 1;
      blocks.forEach((block, i) => {
        // Validate outer fields
        for (const field of group.fields) {
          if (!field.required || field.type === 'heading') continue;
          const el = block.querySelector<HTMLInputElement | HTMLSelectElement>(`:scope > .register-block-fields [data-field-id="${field.id}"]`);
          if (!el || !el.value.trim()) {
            const lbl = showOuter ? `${field.label} (${blockLabel} ${i + 1})` : field.label;
            errors.push(`${lbl} is required`);
            el?.classList.add('invalid');
            if (!firstInvalid && el) firstInvalid = el as HTMLElement;
          } else {
            el?.classList.remove('invalid');
          }
        }
        // Validate inner fields
        if (group.innerRepeatable) {
          const innerBlocks = block.querySelectorAll<HTMLElement>('.inner-block');
          innerBlocks.forEach((innerBlock, j) => {
            for (const field of group.innerRepeatable!.fields) {
              if (!field.required || field.type === 'heading') continue;
              const el = innerBlock.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-inner-field-id="${field.id}"]`);
              if (!el || !el.value.trim()) {
                const lbl = `${field.label} (${blockLabel} ${i + 1}, Register ${j + 1})`;
                errors.push(`${lbl} is required`);
                el?.classList.add('invalid');
                if (!firstInvalid && el) firstInvalid = el as HTMLElement;
              } else {
                el?.classList.remove('invalid');
              }
            }
          });
        }
      });
    } else {
      for (const field of group.fields) {
        if (!field.required || field.type === 'heading') continue;
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

function setElValue(el: HTMLInputElement | HTMLSelectElement, value: string, type: string): void {
  if (type === 'date' && el instanceof HTMLInputElement) {
    const fp = fpInstances.get(el);
    if (fp) {
      const instance = Array.isArray(fp) ? fp[0] : fp;
      instance.setDate(value, false);
      el.classList.toggle('date-empty', !value);
      return;
    }
  }
  el.value = value;
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
