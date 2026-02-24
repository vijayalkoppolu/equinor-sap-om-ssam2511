import ComLib from '../Common/Library/CommonLibrary';

export default function SideDrawerInboundDeliveryItemCount(context) {
     return ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveryItems').then(count=>{
        return context.localizeText('inbound_delivery_items_x', [count]);
    });
}
