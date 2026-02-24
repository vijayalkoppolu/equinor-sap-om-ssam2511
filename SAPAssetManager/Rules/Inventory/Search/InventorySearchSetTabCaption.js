import ComLib from '../../Common/Library/CommonLibrary';
import FetchRequest from '../../Common/Query/FetchRequest';
import PhysicalInventoryItemsListQuery from '../../Inventory/PhysicalInventory/PhysicalInventoryItemsListQuery';
export default async function InventorySearchSetTabCaption(context) {
    const pageName = 'PhysicalInventoryItemsListPage';
    const queryOptions = ComLib.getStateVariable(context, 'INVENTORY_BASE_QUERY', pageName);
        const totalCount = await ComLib.getEntitySetCount(context, 'PhysicalInventoryDocItems', queryOptions);
        let count = 0;
        if (totalCount > 0) {
            const itemsList = await PhysicalInventoryItemsListQuery(context);
            if (itemsList && typeof itemsList.build === 'function') {
                const items = await itemsList.build().then(query => {
                    const fetchRequest = new FetchRequest('PhysicalInventoryDocItems', query);
                    return fetchRequest.execute(context).then(result => {
                        return result;
                    });
                });
                count = items?.length;
            } else {
                count = itemsList.length;
            }
        } else {
            count = totalCount;
        }
    
        if (count === totalCount) {
            return context.localizeText('items_x', [totalCount]);
        }
        return context.localizeText('items_x_x', [count, totalCount]);
}
