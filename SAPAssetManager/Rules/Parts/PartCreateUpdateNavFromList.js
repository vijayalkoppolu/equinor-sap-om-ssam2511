import libCom from '../Common/Library/CommonLibrary';
import CreateServiceItemNav from '../ServiceItems/CreateUpdate/CreateServiceItemNav';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';

export default function PartCreateUpdateNavFromList(clientAPI) {
    if (IsS4ServiceIntegrationEnabled(clientAPI)) {
        return CreateServiceItemNav(clientAPI); 
    }
    libCom.setOnCreateUpdateFlag(clientAPI, 'CREATE');
    return clientAPI.executeAction('/SAPAssetManager/Actions/Parts/VehiclePartCreateNav.action');
}
