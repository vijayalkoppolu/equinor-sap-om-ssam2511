import { getUpdatedItemsFromEDT } from './BulkFLWOSave';
import libCom from '../../../Common/Library/CommonLibrary';
import { UpdateFLItemInLoop } from './BulkFLWOUpdate';
import { FLEntityNames } from '../../Common/FLLibrary';
import BulkFLWOValidate from './BulkFLWOValidate';
export default function BulkFLWOProductNav(context) {
    const clientAPI = context._control.getTable().context.clientAPI;
    let items = getUpdatedItemsFromEDT(clientAPI);
    items = items.filter((item) => item.Properties.ItemSelection);
    libCom.setStateVariable(context, 'BulkFLUpdateNav', true);
    return BulkFLWOValidate(context).then((validationResult) => {
        if (!validationResult) {
            return undefined;
        }
        return UpdateFLItemInLoop(clientAPI.getPageProxy(), items).then(async () => {
            const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', clientAPI.binding['@odata.readLink'], [], '').then((result) => {
                if (result && result.length > 0) {
                    let binding = result.getItem(0);
                    clientAPI.getPageProxy().setActionBinding(binding);
                    if (type === FLEntityNames.WoProduct) {
                        return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLOProductReturnNav.action');
                    } else {
                        return clientAPI.getPageProxy().executeAction('/SAPAssetManager/Actions/FL/WorkOrders/FLResvItemDetailViewNav.action');
                    }
                }
                return undefined;
            });
        });
    });
}
