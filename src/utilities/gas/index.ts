// ============================================================
// Gas Utility — Phase 2 Placeholder
// Architecture ready: processes, dflows, and css will mirror
// the electricity structure when implemented.
// ============================================================

import type { UtilityDefinition } from '../../shared/domain/types';

// Gas process model placeholders (Phase 2)
// export interface GasCoSRegistrationModel { ... }
// export interface GasSupplyRegistrationModel { ... }

export const gasUtility: UtilityDefinition = {
  id: 'gas',
  label: 'Gas',
  icon: '🔥',
  description: 'Gas CoS Registration, Supply Registration (Coming Soon)',
  processes: [],
  comingSoon: true,
};
