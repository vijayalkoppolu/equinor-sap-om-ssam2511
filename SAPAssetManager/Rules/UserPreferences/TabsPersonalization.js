import PersonaLibrary from '../Persona/PersonaLibrary';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default function TabsPersonalization(context) {
    return PersonaLibrary.isTabHomeScreenEnabled(context);
}
