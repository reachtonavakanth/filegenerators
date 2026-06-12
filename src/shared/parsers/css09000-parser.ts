// Parser for CSS09000 JSON event files.
// Detected by filename prefix "CSS09000". Maps correlationId → cssCorrelationId.

export interface Css09000ParseResult {
  fields: Record<string, string>;
  warnings: string[];
  error?: string;
}

export function parseCss09000(text: string): Css09000ParseResult | null {
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    data = parsed as Record<string, unknown>;
  } catch {
    return null;
  }

  if (!('correlationId' in data)) return null;

  const fields: Record<string, string> = {};
  const warnings: string[] = [];

  const correlationId = data['correlationId'];
  if (typeof correlationId === 'string' && correlationId.trim()) {
    fields['cssCorrelationId'] = correlationId.trim();
  } else {
    warnings.push('correlationId is empty — Correlation ID not populated');
  }

  return { fields, warnings };
}
