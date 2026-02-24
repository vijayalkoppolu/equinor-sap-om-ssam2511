export default function WarehouseTaskCreateButtonIsVisible(context) {
    const parentbind = context.getPageProxy()?.binding;
    return !!(parentbind && parentbind['@odata.type'] === '#sap_mobile.WarehouseInboundDeliveryItem');
}
