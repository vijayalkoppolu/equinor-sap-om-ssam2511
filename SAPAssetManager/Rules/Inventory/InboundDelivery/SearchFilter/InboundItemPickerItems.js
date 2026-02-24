import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * IBD Items Picker for PO search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of IBD items
 */
export default async function InboundItemPickerItems(context) {
    const entitySet = 'InboundDeliveryItems';
    const queryOptions = `$select=Item&$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$orderby=Item`;
    const propName = 'Item';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
