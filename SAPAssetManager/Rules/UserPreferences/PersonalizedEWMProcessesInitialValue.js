import { ProcessesPersonalizationMapping } from '../EWM/Common/EWMLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

export default async function PersonalizedEWMProcessesInitialValue(context) {
    const processes = PersonaLibrary.getEWMProcessesPreference(context);

    if (processes) {
        const controlName = context.getName();

        return processes.includes(ProcessesPersonalizationMapping[controlName]);
    }

    return true;
}
