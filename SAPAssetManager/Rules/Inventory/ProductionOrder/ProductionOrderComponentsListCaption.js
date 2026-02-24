import GetComponentsListQuery from './GetComponentsListQuery';
import FetchRequest from '../../Common/Query/FetchRequest';
import ComLib from '../../Common/Library/CommonLibrary';
export default async function ProductionOrderComponentsListCaption(context) {
    const queryOptions = "$filter=(OrderId eq '" + context.getPageProxy().binding.OrderId + "')";
    const totalCount = await ComLib.getEntitySetCount(context, 'ProductionOrderComponents', queryOptions);
    let count = 0;
    if (totalCount > 0) {
        const itemsList = await GetComponentsListQuery(context);
        if (itemsList && typeof itemsList.build === 'function') {
            const items = await itemsList.build().then(query => {
                const fetchRequest = new FetchRequest('ProductionOrderComponents', query);
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
