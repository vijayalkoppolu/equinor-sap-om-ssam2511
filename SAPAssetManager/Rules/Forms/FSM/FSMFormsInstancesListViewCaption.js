import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';

/**
 * Display the smart forms caption count on the list, supporting main list and operations/service items/orders/service orders list plus mdk filters
 * @param {*} context 
 * @returns 
 */
export default function FSMFormsInstanceListViewCaption(context) {
    let totalQueryOption = getQueryBuilder(context);
    let queryOption = getQueryBuilder(context);

    let mdkFilter = libCom.getQueryOptionFromFilter(context);
    if (mdkFilter) { //Combine mdk filter with standard smart form query options
        queryOption = queryOption.replace('$filter=', '');
        queryOption = mdkFilter + ' and ' + queryOption;
    }

    let totalCountPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', totalQueryOption);
    let countPromise = context.count('/SAPAssetManager/Services/AssetManager.service', 'FSMFormInstances', queryOption);

    return Promise.all([totalCountPromise, countPromise]).then(counts => {
        let totalCount = counts[0];
        let count = counts[1];
        if (count === totalCount) {
            return context.setCaption(context.localizeText('smart_forms_x', [totalCount]));
        }
        return context.setCaption(context.localizeText('smart_forms_x_x', [count, totalCount]));
    });
}

function getQueryBuilder(context) {
    const binding = context.binding || {};
    let queryBuilder;

    if ((libCom.isDefined(binding.OperationNo) && libCom.isDefined(binding.OrderId)) || (libCom.isDefined(binding.ObjectID) && libCom.isDefined(binding.ItemNo))) {
        queryBuilder = libForms.getOperationFSMFormsQueryOptions(context, false);
    } else if (libCom.isDefined(binding.OrderId) || libCom.isDefined(binding.ObjectID)) {
        queryBuilder = libForms.getOrderFSMFormsQueryOptions(context, false);
    } else {
        queryBuilder = libForms.getFSMFormsQueryOptions(context, false);
    }

    return queryBuilder;
}
