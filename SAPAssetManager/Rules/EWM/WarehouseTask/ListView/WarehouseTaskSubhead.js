import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WarehouseTaskSubhead(clientAPI) {
    const warehouseTask = CommonLibrary.removeLeadingZeros(clientAPI.binding.WarehouseTask);
    return clientAPI.localizeText('ewm_warehouse_task_x', [warehouseTask]);
}
