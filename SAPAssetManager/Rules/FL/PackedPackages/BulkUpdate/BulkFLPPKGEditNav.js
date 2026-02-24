import { getUpdatedItemsFromEDT } from './BulkFLPSave';
import libCom from '../../../Common/Library/CommonLibrary';
import { UpdateFLItemInLoop } from './BulkFLPUpdate';
export default function BulkFLPPKGEditNav(context) {
    const clientAPI = context._control.getTable().context.clientAPI;
    let items = getUpdatedItemsFromEDT(clientAPI);
    items = items.filter((item) => item.Properties.ItemSelection);
    libCom.setStateVariable(context, 'BulkFLUpdateNav', true);

    let action = '/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackageEditNav.action';
        
        return UpdateFLItemInLoop(clientAPI.getPageProxy(), items).then(async () => {
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', clientAPI.binding['@odata.readLink'], [], '').then((result) => {
                if (result && result.length > 0) {
                    let binding = result.getItem(0);
                    clientAPI.getPageProxy().setActionBinding(binding);

                    return clientAPI.getPageProxy().executeAction(action);

                }
                return undefined;
            });
        });
}


