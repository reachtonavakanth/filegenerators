// Parser for industry data JSON files.
// Detects format by presence of 'distributor_mpid' (absent in form-export JSON).
// Only populates a field when the source value is non-empty — never resets form defaults.

export interface IndustryDataParseResult {
  fields: Record<string, string>;
  meters: Array<Record<string, string>>; // one entry per MeterDetails item, keyed by form field ID
  warnings: string[];
  error?: string; // fatal — caller should not apply this result
}

export function parseIndustryData(text: string): IndustryDataParseResult | null {
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return null;
    data = parsed as Record<string, unknown>;
  } catch {
    return null;
  }

  if (!('distributor_mpid' in data)) return null;

  const fields: Record<string, string> = {};
  const warnings: string[] = [];

  // Only adds to fields when value is non-empty — preserves existing form defaults for blank values
  const pick = (fieldId: string, value: unknown): void => {
    if (typeof value === 'string' && value.trim()) {
      fields[fieldId] = value.trim();
    }
  };

  // Supply point
  pick('mpan',               data['mpan']);
  pick('postcode',           data['postcode']);
  pick('energisationStatus', data['energisation_status']);

  // Technical attributes
  pick('gspGroupId',         data['gsp_group_id']);
  pick('llfClass',           data['line_loss_factor']);
  pick('profileClass',       data['profile_class']);
  pick('measurementClass',   data['measurement_class']);
  pick('ssc',                data['standard_settlement_configuration']);
  pick('sconDate',           data['standard_settlement_configuration_efd']); // YYYYMMDD — form renderer normalises
  pick('mtc',                data['meter_timeswitch_class']);

  // Market parties
  pick('distributorParticipantId', data['distributor_mpid']);
  pick('oldSupplierParticipantId', data['supplier_mpid']);

  // MeterDetails — all entries
  const meterDetails = data['MeterDetails'];
  if (!Array.isArray(meterDetails) || meterDetails.length === 0) {
    warnings.push('No MeterDetails in file — meter fields not populated');
    return { fields, meters: [], warnings };
  }

  const firstMeter = meterDetails[0] as Record<string, unknown>;

  // MPAN cross-check: outer mpan must match MeterDetails.mpan_core
  const outerMpan = typeof data['mpan'] === 'string' ? data['mpan'].trim() : '';
  const innerMpan = typeof firstMeter['mpan_core'] === 'string' ? firstMeter['mpan_core'].trim() : '';
  if (outerMpan && innerMpan && outerMpan !== innerMpan) {
    return {
      fields: {},
      meters: [],
      warnings: [],
      error: `MPAN mismatch — header "${outerMpan}" vs MeterDetails "${innerMpan}"`,
    };
  }

  const meterFieldPick = (m: Record<string, unknown>): Record<string, string> => {
    const entry: Record<string, string> = {};
    const p = (id: string, v: unknown): void => { if (typeof v === 'string' && v.trim()) entry[id] = v.trim(); };
    p('msn',                    m['msn']);
    p('meterType',              m['meter_type']);
    p('meterInstalledDate',     m['meter_install_date']);
    p('manufacturersMakeAndType', m['meter_manufacturer']);
    p('meterAssetProviderId',   m['map_mpid']);
    p('meterLocation',          m['meter_location']);
    return entry;
  };

  const meters: Array<Record<string, string>> = meterDetails
    .map(m => meterFieldPick(m as Record<string, unknown>))
    .filter(e => Object.keys(e).length > 0);

  // Flat fields from first meter — keeps NHH forms (where msn is non-repeatable) working
  for (const [k, v] of Object.entries(meters[0] ?? {})) pick(k, v);

  return { fields, meters, warnings };
}
