import ComLib from '../../Common/Library/CommonLibrary';
import GetInboundDeliveryListQuery from './GetInboundDeliveryItemsListQuery';
import FetchRequest from '../../Common/Query/FetchRequest';
export default async function GetInboundDeliveryItemsListCaption(clientAPI) {
    const pageProxy = clientAPI.getPageProxy();
    const sectionedTable = pageProxy.getControl('SectionedTable');
    const deliveryNum = pageProxy.binding.DeliveryNum;
    const queryOptions = `$filter=(DeliveryNum eq '${deliveryNum}')`;

    const totalCountPromise = ComLib.getEntitySetCount(clientAPI, 'InboundDeliveryItems', queryOptions);
    const countPromise = sectionedTable
        ? getCountPropertyValue(clientAPI)
        : totalCountPromise;

    const [totalCount, count] = await Promise.all([totalCountPromise, countPromise]);

    if (totalCount && totalCount !== count) {
        return clientAPI.localizeText('items_x_x', [count, totalCount]);
    }
    return clientAPI.localizeText('items_x', [count]);
}

async function getCountPropertyValue(clientAPI) {
    const queryBuilder = await GetInboundDeliveryListQuery(clientAPI, false, false);
    const items = await queryBuilder.build().then(query => {
        const fetchRequest = new FetchRequest('InboundDeliveryItems', query);
        return fetchRequest.execute(clientAPI).then(result => {
            return result;
        });
    });
    return items?.length;
}
