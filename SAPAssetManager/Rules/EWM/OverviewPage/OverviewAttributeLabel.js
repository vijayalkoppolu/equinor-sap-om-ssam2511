import { buildFilterAndSearchQuery } from '../WarehouseOrder/WarehouseOrderListQueryOptions';
import { WarehouseTaskListFilterAndSearchQuery } from '../WarehouseTask/ListView/WarehouseTaskListQuery';
import { WHPhysicalInvListFilterAndSearchQuery } from '../PhysicalInventory/WHPhysicalInvListQuery';
import ComLib from '../../Common/Library/CommonLibrary';
import { InboundDeliveryListFilterAndSearchQuery } from '../InboundDelivery/InboundDeliveryListQuery';
import { WHInboundDeliveryItemFilterAndSearchQuery } from '../Inbound/Items/WHInboundDeliveryItemListQuery';
/**
 * Count different objects on the Overview page
 * @param {IClientAPI} context 
 * @returns the count of the objects
 */
export default function OverviewAttributeLabel(context) {
    let countQueryOptions;
    switch (context._control._parent.definition.name) {
        case 'EWMWarehouseOrderSection':
            countQueryOptions = buildFilterAndSearchQuery(context, true, true);
            return ComLib.getEntitySetCount(context, 'WarehouseOrders', countQueryOptions);
        case 'EWMWarehouseTaskSection':
            countQueryOptions = WarehouseTaskListFilterAndSearchQuery(context);
            return ComLib.getEntitySetCount(context, 'WarehouseTasks', countQueryOptions);
        case 'EWMWarehousePhysicalInventorySection':
            countQueryOptions = WHPhysicalInvListFilterAndSearchQuery(context, true, true);
            return ComLib.getEntitySetCount(context, 'WarehousePhysicalInventoryItems', countQueryOptions);
        case 'InboundDeliverySection':
            countQueryOptions = InboundDeliveryListFilterAndSearchQuery(context, true);    
            return ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveries', countQueryOptions);
        case 'InboundDeliveryItemSection':
            countQueryOptions = WHInboundDeliveryItemFilterAndSearchQuery(context, true, true);
            return ComLib.getEntitySetCount(context, 'WarehouseInboundDeliveryItems', countQueryOptions);    
        case 'EWMWarehouseHandlingUnitsSection':
        // fall through
        default:
            return '';
    }
}
