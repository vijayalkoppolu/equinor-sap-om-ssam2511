export default function InboundDeliveryDetailsView(context) {
    return context.getPageProxy().binding?.['@odata.type'] === context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WarehouseInboundDelivery.global').getValue();
}
