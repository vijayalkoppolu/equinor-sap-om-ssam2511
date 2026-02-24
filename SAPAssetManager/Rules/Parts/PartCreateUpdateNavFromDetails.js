import libCom from '../Common/Library/CommonLibrary';
import CreateServiceItemNav from '../ServiceItems/CreateUpdate/CreateServiceItemNav';
import IsS4ServiceIntegrationEnabled from '../ServiceOrders/IsS4ServiceIntegrationEnabled';
import EnableMultipleTechnician from '../SideDrawer/EnableMultipleTechnician';

export default function PartCreateUpdateNavFromDetails(clientAPI) {
    if (IsS4ServiceIntegrationEnabled(clientAPI)) {
        return CreateServiceItemNav(clientAPI);
    }

    let flag = EnableMultipleTechnician(clientAPI) ? 'UPDATE' : 'CREATE';
    libCom.setOnCreateUpdateFlag(clientAPI, flag);
    return clientAPI.executeAction('/SAPAssetManager/Actions/Parts/VehiclePartCreateNav.action');
}
