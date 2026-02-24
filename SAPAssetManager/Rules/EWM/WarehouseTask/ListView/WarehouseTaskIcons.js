import CommonLibrary from '../../../Common/Library/CommonLibrary';
import ODataLibrary from '../../../OData/ODataLibrary';

export default function WarehouseTaskIcons(clientAPI, binding = clientAPI.binding) {
    const icons = [];
    const failedItems = CommonLibrary.getStateVariable(clientAPI, 'WHTFailedItems');
    if (failedItems?.length > 0) {
        const matchedItem = failedItems.find(item => binding.WarehouseNo === item.WarehouseNo 
            && binding.WarehouseTask === item.WarehouseTask);
        if (matchedItem) {
            icons.push('/SAPAssetManager/Images/missing_information.png');
        }
    }

    const hasLocalconfirmationchange = binding?.WarehouseTaskConfirmation_Nav ? binding.WarehouseTaskConfirmation_Nav.some(confirmation => ODataLibrary.hasAnyPendingChanges(confirmation)) : false;
    if (ODataLibrary.hasAnyPendingChanges(binding) || hasLocalconfirmationchange) {
            icons.push('sap-icon://synchronize');
        }

    return icons;
}
