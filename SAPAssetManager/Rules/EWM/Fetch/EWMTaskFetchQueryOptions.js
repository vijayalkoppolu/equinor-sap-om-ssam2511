import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';


export default function EWMOrderFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getEWMTaskFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    return queryBuilder;
}

export function getEWMTaskFilters(context) {
    const filters = [];

    const [wareHouseTask,warehouseOrder,handlingUnit,refDocNumber]=['EWMWarehouseTask','EWMWarehouseOrder','EWMUnit','EWMRefDocNumber'].map(control => {
            return context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue();
        });

   

    const [warehouseno,activityarea,queue,warehouseproctype,sourceBin,destinationBin]=['WarehouseNumberListPicker','EWMActivityAreaListPicker','EWMQueueListPicker','EWMProcessCategoryListPicker','SourceBin','DestinationBin'].map(control => {
        return libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue());
    });

    if (!libVal.evalIsEmpty(warehouseno)) {
        filters.push(`WarehouseNo eq '${warehouseno}'`);
    }

    if (!libVal.evalIsEmpty(warehouseOrder)) {
        filters.push(`WarehouseOrder eq '${warehouseOrder}'`);
    }

    if (!libVal.evalIsEmpty(wareHouseTask)) {
        filters.push(`WarehouseTask eq '${wareHouseTask}'`);
    }

    if (!libVal.evalIsEmpty(handlingUnit)) {
        filters.push(`SourceHU eq '${handlingUnit}'`);
    }

    if (!libVal.evalIsEmpty(refDocNumber)) {
        filters.push(`ReferenceDoc eq '${refDocNumber}'`);
    } 

    if (!libVal.evalIsEmpty(sourceBin)) {
        filters.push(`SourceBin eq '${sourceBin}'`);
    }

    if (!libVal.evalIsEmpty(destinationBin)) {
        filters.push(`DestinationBin eq '${destinationBin}'`);
    }

    if (!libVal.evalIsEmpty(queue)) {
        filters.push(`Queue eq '${queue}'`);
    }

    if (!libVal.evalIsEmpty(activityarea)) {
        filters.push(`ActivityArea eq '${activityarea}'`);
    }    

    if (!libVal.evalIsEmpty(warehouseproctype)) {
        filters.push(`ProcCategory eq '${warehouseproctype}'`);
    }

    return filters;
}
