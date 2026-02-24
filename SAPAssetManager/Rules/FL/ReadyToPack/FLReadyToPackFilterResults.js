
import FilterLibrary from '../../Filter/FilterLibrary';

export default function FLReadyToPackFilterResults(context) {
    const fcWorkOrders = context.getControl('FormCellContainer');
    const sortFilterValue = fcWorkOrders.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);
    const filterResults = ['DestinationPlantFilter', 'SourcePlantFilter', 'PackingStatusFilter','ItemStatusFilter','VoyageAsignStatusFilter'].map((n) => fcWorkOrders.getControl(n).getFilterValue());

    const ContainerID = fcWorkOrders.getControl('ContainerId').getValue();
    if (ContainerID) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsContainerId', context.localizeText('fl_container_id'), [`${ContainerID}`], false));
    }

    const DeliveryDocument = fcWorkOrders.getControl('DeliveryDocument').getValue();
    if (DeliveryDocument) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'DeliveryDocument', context.localizeText('delivery_document'), [`${DeliveryDocument}`], false));
    }

    const ProductID = fcWorkOrders.getControl('Product').getValue();
    if (ProductID) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'Material', context.localizeText('product_id_label'), [`${ProductID}`], false));
    }

    const ProductDescription = fcWorkOrders.getControl('ProductDescription').getValue();
    if (ProductDescription) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'MaterialName', context.localizeText('product'), [`${ProductDescription}`], false));
    }

    filterResults.push(sortFilterValue);
    return filterResults;
} 
