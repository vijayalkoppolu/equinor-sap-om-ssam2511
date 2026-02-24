import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WarehouseTaskNumberWithoutLeadingZeros(clientAPI) {
    const warehouseTask = clientAPI.binding?.WarehouseTask;
    return CommonLibrary.removeLeadingZeros(warehouseTask) || '-';
}
