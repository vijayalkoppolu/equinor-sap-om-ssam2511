
import FilterLibrary from '../../Filter/FilterLibrary';

export default function PackedContainersFilterResults(context) {
    const fcPackContainers = context.getControl('FormCellContainer');
    const sortFilterValue = fcPackContainers.getControl('SortFilter').getValue();
    FilterLibrary.formatDescendingSorterDisplayText(sortFilterValue);
    let filterResults = [];

    const ContainerID = fcPackContainers.getControl('ContainerID').getValue();
    if (ContainerID) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsContainerID', context.localizeText('fl_container_id'), [`${ContainerID}`], false));
    }

    const containerType = fcPackContainers.getControl('ContainerCategory').getValue();
    if (containerType) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsContainerCategory', context.localizeText('fl_container_type'), [`${containerType}`], false));
    }

    const currentPlant = fcPackContainers.getControl('CurrentPlant').getValue();
    if (currentPlant) {
        filterResults.push(context.createFilterCriteria(context.filterTypeEnum.Filter, 'FldLogsCtnCurrentLocation', context.localizeText('current_plant'), [`${currentPlant}`], false));
    }

    filterResults.push(sortFilterValue);
    return filterResults;
} 

