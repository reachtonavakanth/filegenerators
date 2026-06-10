// ============================================================
// Utility Registry — all supported utilities
// ============================================================

import type { UtilityDefinition } from '../shared/domain/types';
import { electricityUtility } from './electricity';
import { electricityMhhsUtility } from './electricity-mhhs';
import { gasUtility } from './gas';

export const allUtilities: UtilityDefinition[] = [
  electricityUtility,
  gasUtility,
  electricityMhhsUtility,
];
