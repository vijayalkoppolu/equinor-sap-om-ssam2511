import libFilter from '../../Common/Library/InventoryFilterLibrary';
/**
 * OBD Items Number Picker for IBD search filter
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of OBD items
 */
export default async function OutboundItemPickerItems(context) {
    const entitySet = 'OutboundDeliveryItems';
    const queryOptions = `$select=Item&$filter=DeliveryNum eq '${context.binding.DeliveryNum}'&$orderby=Item`;
    const propName = 'Item';
    return libFilter.ReadPickerItems(context, entitySet, queryOptions, propName);
}
