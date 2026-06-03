// ============================================================
// Electricity Utility Definition
// ============================================================

import type { UtilityDefinition } from '../../shared/domain/types';
import { cosRegistrationFormGroups } from './business-processes/cos-registration/form-config';
import { mapFormToCOSModel } from './business-processes/cos-registration/model';
import { orchestrateCOSRegistration } from './business-processes/cos-registration/orchestrator';
import { energisationFormGroups } from './business-processes/energisation/form-config';
import { mapFormToEnergisationModel } from './business-processes/energisation/model';
import { orchestrateEnergisation } from './business-processes/energisation/orchestrator';
import { smartHHCOSRegistrationFormGroups } from './business-processes/smart-hh-cos-registration/form-config';
import { mapFormToSmartHHCOSModel } from './business-processes/smart-hh-cos-registration/model';
import { orchestrateSmartHHCOSRegistration } from './business-processes/smart-hh-cos-registration/orchestrator';

export const electricityUtility: UtilityDefinition = {
  id: 'electricity',
  label: 'Electricity',
  icon: '⚡',
  description: 'D-flows & CSS Messages',
  processes: [
    {
      id: 'cos-registration',
      label: 'NHH COS Registration',
      description:
        'D0260 · D0217 · D0011 (MOP/DC/DA) · D0149 · D0150 · D0052 · D0010 · D0086 · D0012 · D0019 · CSS02300_01 · CSS02380_01 · CSS02370_01 · CSS02370_03',
      utilityType: 'electricity',
      formGroups: cosRegistrationFormGroups,
      generate(inputs) {
        const model = mapFormToCOSModel(inputs);
        return orchestrateCOSRegistration(model);
      },
    },
    {
      id: 'smart-hh-cos-registration',
      label: 'Smart HH COS Registration',
      description:
        'D0260 · D0217 · D0011 (MOP/DC/DA) · D0149 · D0150 · D0052 · D0010 · D0086 · D0012 · D0019 · CSS02300_01 · CSS02380_01 · CSS02370_01 · CSS02370_03',
      utilityType: 'electricity',
      formGroups: smartHHCOSRegistrationFormGroups,
      generate(inputs) {
        const model = mapFormToSmartHHCOSModel(inputs);
        return orchestrateSmartHHCOSRegistration(model);
      },
    },
    {
      id: 'energisation',
      label: 'Energisation / De-energisation',
      description:
        'D0142 · D0010 · D0149 · D0150 · CSS02380_01 · CSS02370_01',
      utilityType: 'electricity',
      formGroups: energisationFormGroups,
      generate(inputs) {
        const model = mapFormToEnergisationModel(inputs);
        return orchestrateEnergisation(model);
      },
    },
  ],
};
