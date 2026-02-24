import comLib from '../../Common/Library/CommonLibrary';
import GetMaterialDocItemsListQuery from '../../Inventory/PurchaseOrder/GetMaterialDocItemsListQuery';
import FetchRequest from '../../Common/Query/FetchRequest';
/**
* Describe this function...
* @param {IClientAPI} clientAPI
*/
export default async function MaterialDocumentListCaption(clientAPI) {
    const page = clientAPI.evaluateTargetPath('#Page:' + comLib.getPageName(clientAPI));
    let reverse = false;
    if ( comLib.getPageName(clientAPI) === 'MaterialDocReversalListPage') {
        reverse = true;
    }
    let count = 0;
    const total = page.context.clientData['MaterialDocItems.total'];
    if (clientAPI.getPageProxy().getControl('SectionedTable')) {
        const queryBuilder = await GetMaterialDocItemsListQuery(clientAPI,reverse);
        const items = await queryBuilder?.build().then(query => {
            const fetchRequest = new FetchRequest('MaterialDocItems', query);
            return fetchRequest.execute(clientAPI).then(result => {
                return result;
            });
        });
        count = items?.length;
    } else {
        count = total;
    }


    if (total !== count) {
        return clientAPI.localizeText('material_document_items_title') + ' (' + count + '/' + total + ')';
    } else {
        return clientAPI.localizeText('material_document_items_title') + ' (' + count + ')';
    }
}


