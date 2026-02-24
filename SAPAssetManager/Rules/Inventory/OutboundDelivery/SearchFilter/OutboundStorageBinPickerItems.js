import libFilter from '../../Common/Library/InventoryFilterLibrary';

/**
 * OBD StorageBin Picker for search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of StorageBins
 */
export default async function InboundStorageBinPickerItems(context) {
    const entitySet = 'OutboundDeliveryItems';
    const queryOptions = `$select=StorageBin&$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$orderby=Item`;
    const propName = 'StorageBin';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
