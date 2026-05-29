// ============================================================
// Form Renderer — builds dynamic HTML form from FormGroupDefinition[]
// ============================================================

import type { FormGroupDefinition, FormFieldDefinition } from '../../shared/domain/types';


export function renderFormGroups(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): void {
  container.innerHTML = '';
  for (const group of groups) {
    container.appendChild(buildGroupCard(group));
  }
}

function buildGroupCard(group: FormGroupDefinition): HTMLElement {
  const card = document.createElement('div');
  card.className = 'form-group-card';

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

function buildField(field: FormFieldDefinition): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'field-wrapper';

  const label = document.createElement('label');
  label.className = 'field-label';
  label.htmlFor = `field-${field.id}`;
  label.innerHTML = field.label;
  if (field.required) {
    label.innerHTML += ' <span class="field-required">*</span>';
  }
  wrapper.appendChild(label);

  if (field.type === 'select' && field.options) {
    const select = document.createElement('select');
    select.id = `field-${field.id}`;
    select.name = field.id;
    select.className = 'field-select';
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
    input.id = `field-${field.id}`;
    input.name = field.id;
    input.className = 'field-input';
    input.type = field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : 'text';
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

  if (field.helpText) {
    const help = document.createElement('span');
    help.className = 'field-help';
    help.textContent = field.helpText;
    wrapper.appendChild(help);
  }

  return wrapper;
}

export function collectFormValues(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): Record<string, string> {
  const values: Record<string, string> = {};
  for (const group of groups) {
    for (const field of group.fields) {
      const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
      if (el) {
        // Trim to handle accidental copy-paste whitespace
        let value = el.value.trim();
        // Normalise date: input[type=date] gives YYYY-MM-DD, flows expect YYYYMMDD
        if (field.type === 'date' && value) {
          value = value.replace(/-/g, '');
        }
        values[field.id] = value;
      }
    }
  }
  return values;
}

export function validateForm(
  container: HTMLElement,
  groups: FormGroupDefinition[]
): string[] {
  const errors: string[] = [];
  let firstInvalid: HTMLElement | null = null;

  for (const group of groups) {
    for (const field of group.fields) {
      if (!field.required) continue;
      const el = container.querySelector(`#field-${field.id}`) as HTMLInputElement | HTMLSelectElement | null;
      if (!el || !el.value.trim()) {
        errors.push(`${field.label} is required`);
        el?.classList.add('invalid');
        if (!firstInvalid && el) firstInvalid = el;
      } else {
        el?.classList.remove('invalid');
      }
    }
  }

  if (firstInvalid) {
    firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (firstInvalid as HTMLElement).focus();
  }

  return errors;
}
