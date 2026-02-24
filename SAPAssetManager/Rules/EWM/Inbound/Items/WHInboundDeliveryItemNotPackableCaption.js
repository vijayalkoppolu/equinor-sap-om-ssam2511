import { INBOUND_DELIVERY_ITEM_NOT_PACKABLE_FILTER } from './WHInboundDeliveryItemListQuery';

export default async function WHGetInboundDeliveryItemNotPackableCaption(context) {

    let queryOptions = `$filter=(${INBOUND_DELIVERY_ITEM_NOT_PACKABLE_FILTER})`;
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.WarehouseInboundDelivery') {
        const inboundDelivery = context.binding.EWMDeliveryNum;
        queryOptions += ` and DocumentNumber eq '${inboundDelivery}'`;
    }
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveryItems', queryOptions).then(count => {
        return context.localizeText('not_packable_x', [count]);
    }).catch(error => {
        console.error('InboundDeliveryItem', error);
        return '';
    });
}
