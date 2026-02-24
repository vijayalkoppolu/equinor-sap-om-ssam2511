import ComLib from '../Common/Library/CommonLibrary';

export default function SideDrawerInboundDeliveryCount(context) {
     return ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveries').then(count=>{
        return context.localizeText('inbound_deliveries_x', [count]);
    });
}
