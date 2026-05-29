// ============================================================
// Utility Registry — all supported utilities
// ============================================================

import type { UtilityDefinition } from '../shared/domain/types';
import { electricityUtility } from './electricity';
import { gasUtility } from './gas';

export const allUtilities: UtilityDefinition[] = [
  electricityUtility,
  gasUtility,
];
