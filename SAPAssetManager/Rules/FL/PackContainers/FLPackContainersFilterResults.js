
import FilterLibrary from '../../Filter/FilterLibrary';

export default function FLPackContainersFilterResults(context) {
    const fcWorkOrders = context.getControl('FormCellContainer');
    const sortFilterValue = fcWorkOrders.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);

    
    const filterResults = ['DestinationPlantFilter', 'SourcePlantFilter', 'ItemStatusFilter','VoyageAsignStatusFilter','TransportStatusFilter'].map((n) => fcWorkOrders.getControl(n).getFilterValue());

    const ContainerID = fcWorkOrders.getControl('ContainerId').getValue();
    if (ContainerID) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsContainerID', context.localizeText('fl_container_id'), [`${ContainerID}`], false));
    }

    filterResults.push(sortFilterValue);
    return filterResults;
} 
