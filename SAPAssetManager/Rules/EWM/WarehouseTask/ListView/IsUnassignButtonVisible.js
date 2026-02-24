import IsResourceClaimed from '../../Resource/IsResourceClaimed';

export default function IsUnassignButtonVisible(context, binding = context.getPageProxy().binding) {
    return binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WarehouseOrder.global').getValue() &&
        IsResourceClaimed(context);
}
