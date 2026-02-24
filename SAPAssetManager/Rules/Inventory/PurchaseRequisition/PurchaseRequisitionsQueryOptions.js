import CommonLibrary from '../../Common/Library/CommonLibrary';

export default function PurchaseRequisitionsQueryOptions(context) {
    let queryBuilder = context.dataQueryBuilder();

    queryBuilder.expand('PurchaseRequisitionLongText_Nav,PurchaseRequisitionItem_Nav/PurchaseRequisitionLongText_Nav');

    let searchString = context.searchString;
    if (searchString) {
        let filter = getSearchQuery(searchString.toLowerCase());
        queryBuilder.filter(filter);
    }

    return queryBuilder;
}

function getSearchQuery(searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['PurchaseReqNo'];
        let customSearchQueries = [`PurchaseRequisitionItem_Nav/any(item : (substringof('${searchString}', tolower(item/DocType))))`];
        searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties, customSearchQueries);
    }

    return searchQuery;
}
