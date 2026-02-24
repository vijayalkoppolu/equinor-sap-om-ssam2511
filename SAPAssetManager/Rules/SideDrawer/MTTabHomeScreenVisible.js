import libPersona from '../Persona/PersonaLibrary';
import EnableMaintenanceTechnician from './EnableMaintenanceTechnician';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function MTTabHomeScreenVisible(context) {
    return EnableMaintenanceTechnician(context) && libPersona.isTabHomeScreenEnabled(context);

}
