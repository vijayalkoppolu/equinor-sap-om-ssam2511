
export default function HUDelItemsProductDetailsQuery(context) {
    let queryBuilder = context.dataQueryBuilder();

    let outboundDeliveryDocument = context.binding.OutboundDelivery;
    let outboundDeliveryItem = context.binding.OutboundDeliveryItem;

    queryBuilder.filter(`DeliveryDocument eq '${outboundDeliveryDocument}'`);
    queryBuilder.filter(`DeliveryDocumentItem eq '${outboundDeliveryItem}'`);

    return queryBuilder;
}
