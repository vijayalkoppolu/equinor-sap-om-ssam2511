import WHInboundDeliveryCountUnusedQuantity from '../Inbound/Items/WHInboundDeliveryCountUnusedQuantity';

export default async function IsWarehouseTaskCreateEnabled(context) {
    const unusedqty = await WHInboundDeliveryCountUnusedQuantity(context);
    return unusedqty !== '0';
}
