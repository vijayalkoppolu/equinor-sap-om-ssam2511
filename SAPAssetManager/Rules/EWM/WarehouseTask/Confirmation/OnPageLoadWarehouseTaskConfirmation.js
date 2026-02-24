import libCom from '../../../Common/Library/CommonLibrary';
import {ValidateItems} from './ConfirmAll';

export default function OnPageLoadWarehouseTaskConfirmation(clientAPI) {
    
    libCom.saveInitialValues(clientAPI);

    if (libCom.getStateVariable(clientAPI, 'WHTFailedItems')) {
        let items = [];
        if (clientAPI.binding['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
            items.push(clientAPI.binding.WarehouseTask_Nav);
        } else {
            items.push(clientAPI.binding);
        }
        return ValidateItems(clientAPI, items).then((validationResult) => {
            if (!validationResult.allValid) {
                const actionProperties = {
                    'Name': '/SAPAssetManager/Actions/EWM/WarehouseTasks/Confirmation/WarehouseTaskMissingInfo.action',
                    'Properties': {
                        'Message': '$(L,missing_information)',
                    },
                };
                return clientAPI.executeAction(actionProperties);
            }
            return true;
        });
    }
}
