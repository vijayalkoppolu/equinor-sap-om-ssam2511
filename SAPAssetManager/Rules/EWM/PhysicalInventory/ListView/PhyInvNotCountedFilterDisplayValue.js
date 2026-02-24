
import { WH_PHYINV_NOTCOUNTED_FILTER } from  '../WHPhysicalInvListQuery';
import Logger from '../../../Log/Logger';
export default function PhyInvNotCountedFilterDisplayValue(clientAPI) {
    let queryOptions = `$filter=(${WH_PHYINV_NOTCOUNTED_FILTER})`;
      // Check if clientAPI.binding has type 'WarehouseOrder'
      if (clientAPI.binding && clientAPI.binding['@odata.type'] === '#sap_mobile.WarehouseOrder') {
        const warehouseOrder = clientAPI.binding.WarehouseOrder;
        queryOptions += ` and WarehouseOrder eq '${warehouseOrder}'`;
    }

    return clientAPI.count('/SAPAssetManager/Services/AssetManager.service', 'WarehousePhysicalInventoryItems', queryOptions).then(count => {
        return clientAPI.localizeText('pi_uncounted_x', [count]);
    })
    .catch(error => {
        // Handle the error, possibly by logging or showing a user-friendly message
        Logger.error('PhysicalInventory', error);
        return '';
    });
}
