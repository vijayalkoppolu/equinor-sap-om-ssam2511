import ComLib from '../Common/Library/CommonLibrary';

export default function SideDrawerWarehouseOrderCount(context) {
     return ComLib.getEntitySetCount(context, 'WarehouseOrders').then(count=>{
        return context.localizeText('warehouse_orders_x', [count]);
    });
}
