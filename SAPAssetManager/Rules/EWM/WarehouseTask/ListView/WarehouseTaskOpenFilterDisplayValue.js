
import InboundDeliveryItemDetailsView from '../../Inbound/Items/InboundDeliveryItemDetailsView';
import { WAREHOUSE_TASKS_OPEN_FILTER } from './WarehouseTaskListQuery';

export default function WarehouseTaskOpenFilterDisplayValue(clientAPI, binding = clientAPI.getPageProxy().binding) {
    let baseQuery = `(${WAREHOUSE_TASKS_OPEN_FILTER})`;
    const parentpage = binding?.['@odata.type'];
    
    if (InboundDeliveryItemDetailsView(clientAPI)) {
        const inboundDelivery = binding?.DocumentNumber;
        const inboundDeliveryItem = binding?.ItemNumber.replace(/^0+/, '');
        baseQuery += ` and EWMInbDel eq '${inboundDelivery}' and EWMInbDelItem eq '${inboundDeliveryItem}'`;

    } else if (parentpage === '#sap_mobile.WarehouseOrder') {
        const warehouseOrder = binding?.WarehouseOrder;
        baseQuery += ` and WarehouseOrder eq '${warehouseOrder}'`;
    }

    const queryOptions = `$filter=(${baseQuery})`;

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'WarehouseTasks', queryOptions).then(count => {
        return clientAPI.localizeText('open_ewm_items_x', [count]);
    });
}
