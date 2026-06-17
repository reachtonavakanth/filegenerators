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
import { hhCOSRegistrationFormGroups } from './business-processes/hh-cos-registration/form-config';
import { mapFormToHHCOSModel } from './business-processes/hh-cos-registration/model';
import { orchestrateHHCOSRegistration } from './business-processes/hh-cos-registration/orchestrator';
import { hhD0036FormGroups } from './business-processes/hh-d0036/form-config';
import { mapFormToHHD0036Model } from './business-processes/hh-d0036/model';
import { orchestrateHHD0036 } from './business-processes/hh-d0036/orchestrator';

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
      id: 'hh-advanced-cos-registration',
      label: 'HH Advanced COS Registration',
      description:
        'D0260 · D0217 · D0011 (MOP/DC/DA) · D0051 · D0268 · D0036 · CSS02300_01 · CSS02380_01 · CSS02370_01 · CSS02370_03',
      utilityType: 'electricity',
      formGroups: hhCOSRegistrationFormGroups,
      generate(inputs) {
        const model = mapFormToHHCOSModel(inputs);
        return orchestrateHHCOSRegistration(model);
      },
    },
    {
      id: 'energisation',
      label: 'NHH Energisation / De-energisation',
      description:
        'D0142 · D0010 · D0149 · D0150 · CSS02380_01 · CSS02370_01',
      utilityType: 'electricity',
      formGroups: energisationFormGroups,
      generate(inputs) {
        const model = mapFormToEnergisationModel(inputs);
        return orchestrateEnergisation(model);
      },
    },
    {
      id: 'hh-d0036',
      label: 'HH Consumption (D0036)',
      description: 'D0036 — one file per settlement date, multiple Measurement Quantities per file',
      utilityType: 'electricity',
      formGroups: hhD0036FormGroups,
      generate(inputs) {
        const model = mapFormToHHD0036Model(inputs);
        return orchestrateHHD0036(model);
      },
    },
  ],
};
