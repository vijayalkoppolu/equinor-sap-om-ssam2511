import FilterLibrary from '../../Filter/FilterLibrary';
import CommonLibrary from '../../Common/Library/CommonLibrary';

/**
* @param {IClientAPI} context
*/
export default function ReturnsByProductSearchFilterResults(context) {
    const fcReturnsByProducts = context.getControl('FormCellContainer');
    const [sortFilterValue, dispatchDateSwitch, requestedDeliveryDateSwitch] = ['SortFilter', 'DispatchPeriodSwitch', 'RequestedDeliveryDateSwitch'].map((n) => fcReturnsByProducts.getControl(n).getValue());
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    const filterResults = [
        fcReturnsByProducts.getControl('FLReturnsByProductFilter').getFilterValue(),
        fcReturnsByProducts.getControl('FLReferenceDocumentTypeFilter').getFilterValue(),
        fcReturnsByProducts.getControl('FLSupplyProcessFilter').getFilterValue(),
        fcReturnsByProducts.getControl('FLRecommendedActionFilter').getFilterValue(),
        fcReturnsByProducts.getControl('FLDestinationStorageLocationFilter').getFilterValue(),
        fcReturnsByProducts.getControl('FLDestinationPlantFilter').getFilterValue(),
    ];

    const referenceDocumentNumber = fcReturnsByProducts.getControl('FLReferenceDocumentNumberFilter').getValue();
    if (referenceDocumentNumber) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsReferenceDocumentNumber', context.localizeText('reference_doc_number'), [`${referenceDocumentNumber}`], false));
    }

    if (dispatchDateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.evaluateTargetPath('#Page:FLReturnsByProductFilterPage/#ClientData'), 'FLReturnsByProductFilterPage', 'DispatchedStartDate', 'DispatchPeriodSwitch', 'DispatchedStartDate', 'DispatchedEndDate'));
    }
    if (requestedDeliveryDateSwitch) {
        filterResults.push(CommonLibrary.GetDateIntervalFilterValueDate(context, context.evaluateTargetPath('#Page:FLReturnsByProductFilterPage/#ClientData'), 'FLReturnsByProductFilterPage', 'RequestedShippingDate', 'RequestedDeliveryDateSwitch', 'RequestedDeliveryDate'));
    }
    
    filterResults.push(sortFilterValue);
    return filterResults;
}
