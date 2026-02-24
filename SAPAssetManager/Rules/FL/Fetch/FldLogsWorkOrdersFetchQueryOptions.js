import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function FldLogsWorkOrdersFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getFldLogsWorkOrdersFilters(context).join(' and ');
    queryBuilder.filter(`(${filtersArray})`);
    return queryBuilder;
}

export function getFldLogsWorkOrdersFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
    let [workOrderNumber, product] = ['WorkNetworkOrder', 'WONOProduct'].map(control => {
        return context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue();
    });

    if (!libVal.evalIsEmpty(workOrderNumber)) {
        workOrderNumber = workOrderNumber.toString().padStart(12, '0');
    }

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`Plant eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(workOrderNumber)) {
        filters.push(`Order eq '${workOrderNumber}'`);
    }
    if (!libVal.evalIsEmpty(product)) {
        filters.push(`Product eq '${product}'`);
    }

    return filters;
}
