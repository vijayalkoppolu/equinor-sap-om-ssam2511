/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
import PersonaLibrary from '../Persona/PersonaLibrary';
export default function LayoutSegments(clientAPI) {
    // This function is used to set the layout segments for the user preferences screen.
    let segments = [];
    if (PersonaLibrary.isMaintenanceTechnician(clientAPI)) {
        segments.push({
            'DisplayValue': clientAPI.localizeText('tabs'),
            'ReturnValue': 'tab',
        });
    }
    segments.push({
        'DisplayValue': clientAPI.localizeText('cards'),
        'ReturnValue': 'new',
    });
    segments.push({
        'DisplayValue': '$(L, classic)',
        'ReturnValue': 'classic',
    });

    return segments;
}
