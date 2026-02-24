import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import FilterLibrary from '../../../Filter/FilterLibrary';

const cachedServiceItemListFilterResults = (context) => FilterLibrary.cacheFilterResultIntoClientData(context, ServiceItemListFilterResults);
export default cachedServiceItemListFilterResults;

/** @param {IControlProxy} context */
function ServiceItemListFilterResults(context) {
    const formCellContainer = context.getPageProxy().getControl('FormCellContainer');
    let filterResults = GetServiceItemListFilterCriteria(context, formCellContainer);
    const statusListpicker = filterResults.find(c => c.name === 'MobileStatus_Nav/MobileStatus');


    /** @type {import('../GetItemFilters').ServiceItemListPageClientData} */
    const clientData = context.evaluateTargetPath('#Page:ServiceItemsListViewPage/#ClientData');
    if (clientData.ServiceItemFastFilters) {
        filterResults = filterResults.concat(clientData.ServiceItemFastFilters.getFastFilterValuesFromFilterPage(context, statusListpicker));
    }

    return filterResults.flat().filter(fCriteria => !ValidationLibrary.evalIsEmpty(fCriteria));
}

/** @param {IControlProxy} context */
function GetServiceItemListFilterCriteria(context, formCellContainer) {
    const [sortFilter, typeListpicker] = ['SortFilter', 'TypeLstPicker'].map(controlName => formCellContainer.getControl(controlName).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilter);

    const statusListpicker = formCellContainer.getControl('MobileStatusFilter').getFilterValue();

    let filterResults = [sortFilter, statusListpicker];

    if (!ValidationLibrary.evalIsEmpty(typeListpicker)) {
        typeListpicker.forEach(filter => {
            filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, undefined, filter.DisplayValue, [filter.ReturnValue], true, undefined, [filter.DisplayValue]));
        });
    }

    return filterResults.filter(fCriteria => !ValidationLibrary.evalIsEmpty(fCriteria));
}
