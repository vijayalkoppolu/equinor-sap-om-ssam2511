import { ProcessesPersonalizationMapping } from '../EWM/Common/EWMLibrary';
import PersonaLibrary from '../Persona/PersonaLibrary';

// Make non-editable the last enabled process switch if only one process is selected
export default function PersonalizedEWMProcessIsEditable(context) {
    const processes = PersonaLibrary.getEWMProcessesPreference(context);

    return processes.length  !== 1 || !processes.includes(ProcessesPersonalizationMapping[context.getName()]);
}
