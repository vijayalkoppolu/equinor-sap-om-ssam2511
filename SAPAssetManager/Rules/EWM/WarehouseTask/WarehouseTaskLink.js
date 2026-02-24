import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function WarehouseTaskLink(context) {
    const warehouseTask = CommonLibrary.getStateVariable(context, 'WarehouseTask')
        ? CommonLibrary.getStateVariable(context, 'WarehouseTask').WarehouseTask
        : context.binding?.WarehouseTask ?? CommonLibrary.getStateVariable(context, 'WarehouseTaskValue');

    return context.read('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', [], `$filter=WarehouseTask eq '${warehouseTask}'&$expand=WarehouseTaskConfirmation_Nav`).then(result => {
        return result.getItem(0)['@odata.readLink'];
    });
}
