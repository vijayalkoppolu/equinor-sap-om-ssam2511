
import libCom from '../../Common/Library/CommonLibrary';
import libForms from './FSMSmartFormsLibrary';
import FSMFormsInstancesListViewCaption from './FSMFormsInstancesListViewCaption';
import ModifyListViewSearchCriteria from '../../LCNC/ModifyListViewSearchCriteria';

export default function FSMFormsInstancesListViewQueryOption(context) {
    if (libForms.isSmartFormsFeatureEnabled(context) || libForms.isS4SmartFormsFeatureEnabled(context)) {
        checkPageName(context);

        const queryBuilder = getQueryBuilder(context);

        let searchString = context.searchString;
        if (searchString) {
            const searchQuery = getSearchQuery(context, searchString.toLowerCase());
            if (queryBuilder.hasFilter) {
                queryBuilder.filter().and(searchQuery);
            } else {
                queryBuilder.filter(searchQuery);
            }
        }

        return queryBuilder;
    }

    return '';
}

function getQueryBuilder(context) {
    const binding = context.binding || {};
    let queryBuilder;

    if ((libCom.isDefined(binding.OperationNo) && libCom.isDefined(binding.OrderId)) || (libCom.isDefined(binding.ObjectID) && libCom.isDefined(binding.ItemNo))) {
        queryBuilder = libForms.getOperationFSMFormsQueryOptions(context);
    } else if (libCom.isDefined(binding.OrderId) || libCom.isDefined(binding.ObjectID)) {
        queryBuilder = libForms.getOrderFSMFormsQueryOptions(context);
    } else {
        queryBuilder = libForms.getFSMFormsQueryOptions(context);
    }

    return queryBuilder;
}

function checkPageName(context) {
    if (libCom.getPageName(context) === 'FSMSmartFormsInstancesListViewPage') {
        FSMFormsInstancesListViewCaption(context.getPageProxy());
    }
}

function getSearchQuery(context, searchString) {
    let searchQuery = '';

    if (searchString) {
        let searchByProperties = ['Description', 'WorkOrder', 'Operation', 'FSMFormTemplate_Nav/Description', 'FSMFormTemplate_Nav/Name'];
        ModifyListViewSearchCriteria(context, 'FSMFormInstance', searchByProperties);

        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }

    return searchQuery;
}
