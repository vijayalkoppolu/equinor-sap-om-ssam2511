import libVal from '../../../Common/Library/ValidationLibrary';

export default function HUDelItemsStatusText(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerItemStatuses', [], `$filter=FldContainerItemStatus eq '${clientAPI.binding.ContainerItemStatus}'`).then(function(results) {
        if (!libVal.evalIsEmpty(results)) {
            return results.getItem(0).FldContainerItemStatusDesc;
        }
        return '';
    });
}
