import PersonaLibrary from '../../../Persona/PersonaLibrary';

export default async function ServiceRequestsDetailsPageToOpen(clientAPI) {
    return PersonaLibrary.isNewHomeScreenEnabled(clientAPI) ? '/SAPAssetManager/Pages/ServiceOrders/ServiceRequests/ServiceRequestDetails.page' : '/SAPAssetManager/Pages/ServiceOrders/ServiceRequests/ServiceRequestDetailsClassic.page';
}

export function ServiceRequestDetailsPageName(context) {
    return PersonaLibrary.isNewHomeScreenEnabled(context) ? 'ServiceRequestDetailsPage' : 'ServiceRequestDetailsClassicPage';
}
