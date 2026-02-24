import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { WarehouseOrderStatus } from '../Common/EWMLibrary';


export default function EWMOrderFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getEWMOrderFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    
    return queryBuilder;
}

export function getEWMOrderFilters(context) {
    const filters=[];

    const [warehouseno,queue,activityarea,warehouseproctype,createdby] = ['WarehouseNumberListPicker','QueueListPicker','ActivityAreaListPicker','ProcessTypeListPicker','CreatedByListPicker'].map(control => {
        return libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue());
    });

    const [warehouseorder,refDocNumber,creationDateRangeSwitch,creationStartDate,creationEndDate]=['WarehouseOrder','RefDocNumber','CreationDateRangeSwitch','CreationStartDate','CreationEndDate'].map(control => {
        return context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue();
    });


    const [createStartDate,createEndDate] = [creationStartDate,creationEndDate].map(date => new ODataDate(date));

    if (!libVal.evalIsEmpty(warehouseno)) {
        filters.push(`WarehouseNo eq '${warehouseno}'`);
    }

    if (!libVal.evalIsEmpty(warehouseorder)) {
        filters.push(`WarehouseOrder eq '${warehouseorder}'`);
    }

    if (!libVal.evalIsEmpty(queue)) {
        filters.push(`Queue eq '${queue}'`);
    }

    if (!libVal.evalIsEmpty(activityarea)) {
        filters.push(`ActivityArea eq '${activityarea}'`);
    }    

    if (!libVal.evalIsEmpty(warehouseproctype)) {
        filters.push(`WOProcessType eq '${warehouseproctype}'`);
    } 

    if (!libVal.evalIsEmpty(createdby)) {
        filters.push(`CreatedBy eq '${createdby}'`);
    }
    /* The DB field for creation datetime is a decimal field so the remove the characters : T - from the date string */
    let odataCreationStartDate = createStartDate.toDBDateTimeString(context).replace(/[-:T]/g, '');
    let odataCreationEndDate = createEndDate.toDBDateTimeString(context).replace(/[-:T]/g, '');
    if (creationDateRangeSwitch && !libVal.evalIsEmpty(createStartDate) && !libVal.evalIsEmpty(createEndDate)) {
        filters.push(`(CrtDateFrom ge '${odataCreationStartDate}' and CrtDateTo le '${odataCreationEndDate}')`);
    }

    if (!libVal.evalIsEmpty(refDocNumber)) {
        filters.push(`ReferenceDoc eq '${refDocNumber}'`);
    } 

    filters.push(`(WOStatus eq '${WarehouseOrderStatus.Open}' or WOStatus eq '${WarehouseOrderStatus.InProgess}')`);

    return filters;

}
