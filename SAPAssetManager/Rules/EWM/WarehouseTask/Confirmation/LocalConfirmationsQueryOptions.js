import CommonLibrary from '../../../Common/Library/CommonLibrary';

export default function WarehouseTaskQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.orderBy('WarehouseTaskItem');
    queryBuilder.expand(
        'WarehouseTask_Nav',
        'WarehouseTask_Nav/WarehouseProcessCategory_Nav',
        'WarehouseTask_Nav/WarehouseTaskSerialNumber_Nav',
        'WarehouseTask_Nav/WarehouseProcessType_Nav',
        'WarehouseTask_Nav/WarehouseTaskConfirmation_Nav',
        'WarehousePickHUTaskC_Nav',
    );

    const filterQuery = LocalConfirmationFilterAndSearchQuery(context, true);
    if (filterQuery) {
        queryBuilder.filter(filterQuery.replace('$filter=', ''));
    }

    return queryBuilder;
}


export function LocalConfirmationFilterAndSearchQuery(context, addSearch = false, binding = context.binding) {

    const warehouseTask = binding?.WarehouseTask;
    let filterString = `$filter=(WarehouseTask eq '${warehouseTask}')`;

    if (addSearch && context.searchString) {
        const searchString = context.searchString.toLowerCase();
        const searchByProperties = [
            'WarehouseTask',
            'WarehouseTask_Nav/Product',
            'SrcHU',
            'DestHU',
            'DestinationBin',
            'WarehouseTask_Nav/SourceBin',
        ];
        const searchQuery = CommonLibrary.combineSearchQuery(searchString, searchByProperties);

        filterString = CommonLibrary.attachFilterToQueryOptionsString(filterString, searchQuery);
    }

    return filterString;
}
