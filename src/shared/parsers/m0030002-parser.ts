// Parser for M0030002 (.usr) raw data files.
// Validates that ZHV row position 2 is exactly "M0030002" before extracting fields.

export interface M0030002ParseResult {
  fields: Record<string, string>;
  warnings: string[];
  error?: string;
}

export function parseM0030002(text: string): M0030002ParseResult | null {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) return null;

  // Validate file type from ZHV header
  const zhvLine = lines.find(l => l.startsWith('ZHV|'));
  if (!zhvLine) return null;

  const zhvParts = zhvLine.split('|');
  if (zhvParts[2] !== 'M0030002') return null;

  const fields: Record<string, string> = {};
  const warnings: string[] = [];

  const pick = (fieldId: string, value: string | undefined): void => {
    if (value && value.trim()) fields[fieldId] = value.trim();
  };

  for (const line of lines) {
    const parts = line.split('|');
    const rowType = parts[0];

    if (rowType === 'REQ') {
      // REQ|Reg Type|Change of Supplier Date|
      //      0   1   2
      pick('cosDate', parts[2]);

    } else if (rowType === 'MPN') {
      // MPN|...|...|...|...|MPAN|
      //      0   1   2   3   4   5
      pick('mpan', parts[5]);

    } else if (rowType === 'CSS') {
      // CSS|Supplier Generated Reference|...|
      //      0   1
      pick('supplierGeneratedReference', parts[1]);

    } else if (rowType === 'AGD') {
      const role = parts[1];

      if (role === 'MOP') {
        // AGD|MOP|New MOP Participant ID|H|MOP Contract Reference|...|MOP Service Level Ref|MOP Service Ref|
        //      0   1   2                  3  4                     5    6                     7
        pick('mopParticipantId',   parts[2]);
        pick('contractRefMop',     parts[4]);
        pick('mopServiceLevelRef', parts[6]);
        pick('mopServiceRef',      parts[7]);

      } else if (role === 'DA') {
        pick('daParticipantId',   parts[2]);
        pick('contractRefDa',     parts[4]);
        pick('daServiceLevelRef', parts[6]);
        pick('daServiceRef',      parts[7]);

      } else if (role === 'DC') {
        pick('dcParticipantId',   parts[2]);
        pick('contractRefDc',     parts[4]);
        pick('dcServiceLevelRef', parts[6]);
        pick('dcServiceRef',      parts[7]);
      }
    }
  }

  const expectedFields = [
    'mpan', 'cosDate', 'supplierGeneratedReference',
    'mopParticipantId', 'contractRefMop', 'mopServiceLevelRef', 'mopServiceRef',
    'daParticipantId',  'contractRefDa',  'daServiceLevelRef',  'daServiceRef',
    'dcParticipantId',  'contractRefDc',  'dcServiceLevelRef',  'dcServiceRef',
  ];

  for (const key of expectedFields) {
    if (!fields[key]) {
      warnings.push(`${key} not found or empty in file`);
    }
  }

  return { fields, warnings };
}
