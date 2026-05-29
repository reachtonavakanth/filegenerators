// ============================================================
// Electricity Utility Definition
// ============================================================

import type { UtilityDefinition } from '../../shared/domain/types';
import { cosRegistrationFormGroups } from './business-processes/cos-registration/form-config';
import { mapFormToCoSModel } from './business-processes/cos-registration/model';
import { orchestrateCoSRegistration } from './business-processes/cos-registration/orchestrator';
import { energisationFormGroups } from './business-processes/energisation/form-config';
import { mapFormToEnergisationModel } from './business-processes/energisation/model';
import { orchestrateEnergisation } from './business-processes/energisation/orchestrator';

export const electricityUtility: UtilityDefinition = {
  id: 'electricity',
  label: 'Electricity',
  icon: '⚡',
  description: 'CoS Registration, Energisation',
  processes: [
    {
      id: 'cos-registration',
      label: 'CoS Registration',
      description:
        'Change of Supplier Registration — generates D0260, D0217 (×3), D0011 (MOP/DC/DA), D0149, D0150, D0052, D0010, D0086, D0012, D0019 + CSS02300_01, CSS02380_01, CSS02370_01/03',
      utilityType: 'electricity',
      formGroups: cosRegistrationFormGroups,
      generate(inputs) {
        const model = mapFormToCoSModel(inputs);
        return orchestrateCoSRegistration(model);
      },
    },
    {
      id: 'energisation',
      label: 'Energisation / De-energisation',
      description:
        'Supply Energisation or De-energisation — generates D0142, D0010, D0149, D0150 + CSS JSON',
      utilityType: 'electricity',
      formGroups: energisationFormGroups,
      generate(inputs) {
        const model = mapFormToEnergisationModel(inputs);
        return orchestrateEnergisation(model);
      },
    },
  ],
};
