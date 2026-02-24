import { INBOUND_DELIVERY_ITEM_UNPACKED_FILTER } from './WHInboundDeliveryItemListQuery';

export default async function WHGetInboundDeliveryItemUnpackedCaption(context) {

    let queryOptions = '';
    if (context.binding && context.binding['@odata.type'] === '#sap_mobile.WarehouseInboundDelivery') {
        const inboundDelivery = context.binding.EWMDeliveryNum;
        queryOptions += `DocumentNumber eq '${inboundDelivery}'`;
    }
    return CountOpenItems(context, queryOptions).then(count => {
        return context.localizeText('unpacked_x', [count]);
    }).catch(error => {
        console.error('InboundDeliveryItem', error);
        return '';
    });
}

export function CountOpenItems(context, query) {
    let queryOptions = `$filter=(${INBOUND_DELIVERY_ITEM_UNPACKED_FILTER})`;
    queryOptions += query ? ` and (${query})` : '';
    return context.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseInboundDeliveryItems', queryOptions);
}
