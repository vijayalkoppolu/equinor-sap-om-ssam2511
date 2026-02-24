import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';


export default function EWMPhysicalInventoryFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    queryBuilder.expand('WarehousePhysicalInventory_Nav');
    const filtersArray = getEWMPhysicalInventoryFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    
    return queryBuilder;
}

export function getEWMPhysicalInventoryFilters(context) {
    const filters=[];

    const [
        PhysInvDocumentYear,
        PhysInvDocument,
        PhysInvWarehouseOrder,
        PhysInvStorageType,
        PhysInvStorageBin,
        PlannedCountDateRangeSwitch,
        PlannedCountStartDate,
        PlannedCountEndDate,
        PhysInvReason,
        PhysInvPriority,
    ] = [
        'PhysInvDocumentYear',
        'PhysInvDocument',
        'PhysInvWarehouseOrder',
        'PhysInvStorageType',
        'PhysInvStorageBin',
        'PlannedCountDateRangeSwitch',
        'PlannedCountStartDate',
        'PlannedCountEndDate',
        'PhysInvReason',
        'PhysInvPriority',
    ].map(control => {
        return context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue();
    });
    
    if (!libVal.evalIsEmpty( PhysInvDocumentYear ))   { 
        filters.push(`DocumentYear eq '${PhysInvDocumentYear}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvDocument ))       { 
        filters.push(`PIDocumentNo eq '${PhysInvDocument}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvWarehouseOrder )) { 
        filters.push(`WarehouseOrder eq '${PhysInvWarehouseOrder}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvStorageType ))    { 
        filters.push(`StorageType eq '${PhysInvStorageType}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvStorageBin ))     { 
        filters.push(`StorageBin eq '${PhysInvStorageBin}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvReason ))         { 
        filters.push(`ReasonfPhysInv eq '${PhysInvReason}'`); 
    }
    if (!libVal.evalIsEmpty( PhysInvPriority ))       { 
        filters.push(`PhysInvPrior eq '${PhysInvPriority}'`); 
    }
    /*
     * This code segment is for a date picker item that can be hidden or shown in the UI via a switch.
     * The request is sent to the server only when the date picker is not hidden and both start and end dates are selected.
     * Then we create a query that checks if the count date attribute is in the selected range.
     * The date format is converted in a way that comparison can be made on it.
     */
    const [StartDate,EndDate] = [PlannedCountStartDate,PlannedCountEndDate].map(date => new ODataDate(date));
    if (PlannedCountDateRangeSwitch && !libVal.evalIsEmpty(StartDate) && !libVal.evalIsEmpty(EndDate)) {
        filters.push(`(PlannedCountDate ge datetime'${StartDate.toDBDateTimeString(context)}' and PlannedCountDate le datetime'${EndDate.toDBDateTimeString(context)}')`);
    }

    const PhysicalInventoryProcedureListPicker = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${'PhysicalInventoryProcedureListPicker'}`).getValue());
    if (!libVal.evalIsEmpty( PhysicalInventoryProcedureListPicker )) {
        filters.push(`PhysInvProcedure eq '${PhysicalInventoryProcedureListPicker}'`);
    }

    const WarehouseNo = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${'WarehouseNumberListPicker'}`).getValue());
    if (!libVal.evalIsEmpty( WarehouseNo )) {
        filters.push(`WarehouseNo eq '${WarehouseNo}'`);
    }

    return filters;
}
