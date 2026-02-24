import GetItemsListQuery from '../../Inventory/Common/GetItemsListQuery';
import FetchRequest from '../../Common/Query/FetchRequest';
export default async function PurchaseOrderItemsListCaption(context) {
    //  const totalItems = await GetItemsListQuery(context,false,false);
    const array = context.binding._array;
    const totalCount = array.length;
    let count = 0;
    if (totalCount > 0) {
        const itemsList = await GetItemsListQuery(context);
        if (itemsList && typeof itemsList.build === 'function') {
            // Extract text before the first '('
           const match = array[0]['@odata.readLink'].match(/^([^(]+)/);
            const entityName = match ? match[1] : null;
            const items = await itemsList.build().then(query => {
                const fetchRequest = new FetchRequest(entityName, query);
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



