import { WarehouseTaskStatus } from '../../Common/EWMLibrary';

export default function WarehouseTaskStatusText(clientAPI) {
    const binding = clientAPI.binding;
    const status = binding['@odata.type'] === clientAPI.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WarehouseTaskConfirmation.global').getValue() ?
        binding.WarehouseTask_Nav.WTStatus :
        binding.WTStatus;

    if (status === WarehouseTaskStatus.Open || status === WarehouseTaskStatus.Waiting) {
        return clientAPI.localizeText('open_ewm_items');
    }
    if (status === WarehouseTaskStatus.Confirmed) {
        return clientAPI.localizeText('confirmed_ewm_items');
    }
    return '';
}
