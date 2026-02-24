import { getUpdatedItemsFromEDT } from './BulkFLPSave';
import BulkFLWOValidate from './BulkFLPValidate';
import libCom from '../../../Common/Library/CommonLibrary';
import { UpdateFLItemInLoop } from './BulkFLPUpdate';
import IsInitiateReturn from '../../Common/IsInitiateReturn';
export default function BulkFLPProductNav(context) {
    const clientAPI = context._control.getTable().context.clientAPI;
    let items = getUpdatedItemsFromEDT(clientAPI);
    items = items.filter((item) => item.Properties.ItemSelection);
    libCom.setStateVariable(context, 'BulkFLUpdateNav', true);

    let query = '$expand=FldLogsRecommendedAction_Nav, FldLogsReturnStatus_Nav, FldLogsSupproc_Nav, FldLogsRefDocType_Nav, FldLogsShippingPoint_Nav';
    let action = '';

    return BulkFLWOValidate(context).then((validationResult) => {
        if (!validationResult) {
            return undefined;
        }
        if (IsInitiateReturn(clientAPI.binding.FldLogsReturnStatus)) {
            action = '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPInitiateReturnNav.action';
        } else
            action = '/SAPAssetManager/Actions/FL/ReturnsByProduct/FLPUpdatePickQuantityNav.action';

        return UpdateFLItemInLoop(clientAPI.getPageProxy(), items).then(async () => {
            return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', clientAPI.binding['@odata.readLink'], [], query).then((result) => {
                if (result && result.length > 0) {
                    let binding = result.getItem(0);
                    clientAPI.getPageProxy().setActionBinding(binding);

                    return clientAPI.getPageProxy().executeAction(action);

                }
                return undefined;
            });
        });
    });
}

