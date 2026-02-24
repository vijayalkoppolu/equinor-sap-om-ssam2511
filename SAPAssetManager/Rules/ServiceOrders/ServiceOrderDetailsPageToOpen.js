import PersonaLibrary from '../Persona/PersonaLibrary';
import EDTSoftInputModeConfig from '../Extensions/EDT/EDTSoftInputModeConfig';

export default async function ServiceOrderDetailsPageToOpen(clientAPI) {
    EDTSoftInputModeConfig(clientAPI);
    return PersonaLibrary.isClassicHomeScreenEnabled(clientAPI) ? '/SAPAssetManager/Pages/ServiceOrders/ServiceOrderDetailsClassic.page' : '/SAPAssetManager/Pages/ServiceOrders/ServiceOrderDetails.page';
}

export function ServiceOrderDetailsPageName(context) {
    return PersonaLibrary.isClassicHomeScreenEnabled(context) ? 'ServiceOrderDetailsClassic' :  'ServiceOrderDetailsPage';
}
