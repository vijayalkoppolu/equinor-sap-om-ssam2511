import libPersona from '../Persona/PersonaLibrary';
import { LayoutStyleValues } from './PersonalizationPreferences';

/**
* Gets user preference for new home screen layout switch
* @param {IClientAPI} clientAPI
*/
export default function LayoutStyleValue(context) {
    return libPersona.getLayoutStylePreference(context) || LayoutStyleValues.New;
}
