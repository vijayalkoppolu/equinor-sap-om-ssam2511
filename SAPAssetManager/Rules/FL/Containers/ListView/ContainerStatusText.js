import libVal from '../../../Common/Library/ValidationLibrary';

export default function ContainerStatusText(clientAPI) {
    return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsContainerStatuses', [], `$filter=FldContainerStatus eq '${clientAPI.binding.ContainerStatus}'`).then(function(results) {
        if (!libVal.evalIsEmpty(results)) {
            return results.getItem(0).FldContainerStatusDescription;
        }
        return '';
    });
}
