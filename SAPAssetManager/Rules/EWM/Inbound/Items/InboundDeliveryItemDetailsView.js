export default function InboundDeliveryItemDetailsView(context) {
    return context.getPageProxy().binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WarehouseInboundDeliveryItem.global').getValue();
}
