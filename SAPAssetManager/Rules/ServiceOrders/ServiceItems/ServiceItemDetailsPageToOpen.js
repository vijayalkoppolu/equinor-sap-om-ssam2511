import libPersona from '../../Persona/PersonaLibrary';
import EDTSoftInputModeConfig from '../../Extensions/EDT/EDTSoftInputModeConfig';

export default function ServiceItemDetailsPageToOpen(context) {
    EDTSoftInputModeConfig(context);
    return libPersona.isClassicHomeScreenEnabled(context) ? '/SAPAssetManager/Pages/ServiceOrders/ServiceItems/ServiceItemDetailsClassic.page' : '/SAPAssetManager/Pages/ServiceOrders/ServiceItems/ServiceItemDetails.page';
}

export function ServiceItemDetailsPageName(context) {
    return libPersona.isClassicHomeScreenEnabled(context) ? 'ServiceItemDetailsClassicPage' : 'ServiceItemDetailsPage';
}
