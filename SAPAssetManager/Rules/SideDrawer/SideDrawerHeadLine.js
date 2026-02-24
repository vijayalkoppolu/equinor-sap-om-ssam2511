import libSuper from '../Supervisor/SupervisorLibrary';
import personalLib from '../Persona/PersonaLibrary';

export default async function SideDrawerHeadLine(context) {
    const activePersonaCode = personalLib.getActivePersonaCode(context);
    const activePersona = personalLib.getActivePersona(context);

    if (!activePersonaCode || !activePersona) {
        // If no active persona code or active persona is found, return an empty string
        return '';
    }

    let headline = '';

    try {
        const personaArray = await context.read('/SAPAssetManager/Services/AssetManager.service', 'UserPersonas', [], `$filter=PersonaCode eq '${activePersonaCode}' and UserPersona eq '${activePersona}'`);
        const persona = personaArray?.getItem(0);
        headline = persona?.PersonaCodeDesc || '';

        if (persona?.PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/MTPersonaName.global').getValue()) {
            if (persona.FlagExternal === 'X') {
                headline = context.localizeText('external_technician');
            } else if (libSuper.isSupervisorFeatureEnabled(context)) {
                const isSupervisor = await libSuper.isUserSupervisor(context);
                if (isSupervisor) {
                    headline = context.localizeText('supervisor');
                }
            }
        } else if (persona?.PersonaCode === context.getGlobalDefinition('/SAPAssetManager/Globals/PersonaNames/FSTPersonaName.global').getValue()) {
            if (persona.FlagExternal === 'X') {
                headline = context.localizeText('external_field_service');
            }
        }
        return headline;
    } catch {
        return '';
    }
}
