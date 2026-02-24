import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import ModifyListViewSearchCriteria from '../../../LCNC/ModifyListViewSearchCriteria';
export default async function BulkEditSearch(context) {
    let sections = context.getPageProxy().getControls()[0]?.getSections();
    let bulkFLSearch = [];
    let bulkFLSearchGet = [];
    let totalItems = 0;
    if (sections) {
        // Step 1: Loop through sections and create key-value pairs
        const sectionValuesArray = sections.map((section, index) => {
            return { index, value: section.getExtension?.()?.getAllValues()[0] };
        });
        //Workaround for the filter refresh issue   
        if (context.filters) {
            const filter = context.filters;
            context.filters = filter;
        } else {
            const pageClientAPI = context.getPageProxy();
            libCom.setStateVariable(pageClientAPI, 'filterCount', 0, libCom.getPageName(pageClientAPI));
        }
        context.getPageProxy()._page._redrawActionBar();
        for (let index = 2; index < sections.length; index += 2) {

            let section = sections[index];
            let sectionValue = sectionValuesArray[index].value;

            if (context.searchString || context.getFilterActionResult()) {
                bulkFLSearchGet = libCom.getStateVariable(context, 'BulkFLSearch');
                if (bulkFLSearchGet) {
                    sectionValue = bulkFLSearchGet.find(item => item.index === index)?.sectionValue;
                }
            }
            if (sectionValue) {
                bulkFLSearch.push({ index, sectionValue });
            }
            let searchResult = await partialSearchODataResult(sectionValue, context);
            if (searchResult) {
                sections[index - 1].setVisible(true);
                section.setVisible(true);
                totalItems = totalItems + 1;
            } else {
                sections[index - 1].setVisible(false);
                section.setVisible(false);
            }
        }
        libCom.setStateVariable(context, 'BulkUpdateItem', totalItems);
    }

    if (!libVal.evalIsEmpty(context.searchString) || context.getFilterActionResult()) {

        libCom.setStateVariable(context, 'BulkFLSearch', bulkFLSearch);

    }
    return '$top=1';
}

// Function to perform a partial search on the OData result
function partialSearchODataResult(odataResult, context) {
    if (!context.searchString && !context.getFilterActionResult()) {
        return true;
    }
    if (!odataResult) {
        return false;
    }

    let filterOptions = [];
    let readLink = odataResult.OdataBinding['@odata.readLink'];
    let entityType = odataResult.OdataBinding['@odata.type'].substring('#sap_mobile.'.length);

    // Convert key-value pairs to query options
    const valueInBrackets = readLink.substring(readLink.indexOf('(') + 2, readLink.lastIndexOf(')') - 1);
    let queryOptions = `ObjectId eq '${valueInBrackets}'`;

    const expand = '&$expand=FldLogsCtnPkgPackingStatus_Nav,FldLogsPackCtnContainerItem_Nav,FldLogsPackCtnContainerPkg_Nav,FldLogsPackCtnContainerVyg_Nav';
    queryOptions += expand;
    filterOptions.push(queryOptions);
    // Extract the entity set name
    const entitySetName = readLink.substring(0, readLink.indexOf('('));

    if (context.getFilterActionResult()) {
        filterOptions.push(getCurrentFilters(context));
    }
    if (context.searchString) {
        filterOptions.push(getSearchQuery(context, context.searchString.toLowerCase(), entityType));
    }
    let filterquery = filterOptions.filter((filterOption => !!filterOption)).reduce(function(filterString, filterOption) {
        return libCom.attachFilterToQueryOptionsString(filterString, filterOption);
    }, '');
    return context.read('/SAPAssetManager/Services/AssetManager.service', entitySetName, [], filterquery).then(result => {
        return result?.length > 0;
    });
}
function getCurrentFilters(context) {
    return libCom.getFormattedQueryOptionFromFilter(context);
}
function getSearchQuery(context, searchString, entityType) {
    let searchQuery = '';
    if (searchString) {
        let searchByProperties = ['FldLogsContainerID', 'FldLogsContainerCategoryText', 'FldLogsSrcePlnt', 'FldLogsDestPlnt', 'FldLogsShptCtnIntTranspStsText', 'FldLogsVoyAssgmtStatusText', 'FldLogsCtnPackgStsText'];
        ModifyListViewSearchCriteria(context, entityType, searchByProperties);
        searchQuery = libCom.combineSearchQuery(searchString, searchByProperties);
    }
    return searchQuery;
}
