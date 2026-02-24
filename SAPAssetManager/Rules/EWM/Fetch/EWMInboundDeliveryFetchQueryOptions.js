import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import GetWarehouseNumber from '../Resource/GetWarehouseNumber';

export default function EWMInboundDeliveryFetchQueryOptions(context, directSearch = false) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getEWMInboundDeliveryFilters(context, directSearch).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    
    return queryBuilder;
}

export function getEWMInboundDeliveryFilters(context, directSearch = false) {
    if (directSearch) {
        return getDirectSearchEWMInboundDeliveryFilters(context);
    }

    const filters = [];

    const [
        EWMDeliveryNum,
        INBRefDocNumber,
        PlannedDeliveryDateRangeSwitch,
        PlannedDeliveryStartDate,
        PlannedDeliveryEndDate,
        InboundDeliveryDoorNumber,
        HUNumber,
    ] = [
        'EWMDeliveryNum',
        'INBRefDocNumber',
        'PlannedDeliveryDateRangeSwitch',
        'PlannedDeliveryStartDate',
        'PlannedDeliveryEndDate',
        'InboundDeliveryDoorNumber',
        'HUNumber',
    ].map(control => {
        return context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${control}`).getValue();
    });

    const WarehouseNum = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${'WarehouseNumberListPicker'}`).getValue());
    if (!libVal.evalIsEmpty( WarehouseNum )) {
        filters.push(`WarehouseNum eq '${WarehouseNum}'`);
    }

    const vendor = libCom.getListPickerValue(context.evaluateTargetPath(`#Page:EWMFetchDocumentsPage/#Control:${'InboundDeliveryVendorListPicker'}`).getValue());
    if (!libVal.evalIsEmpty( vendor )) {
        filters.push(`Vendor eq '${vendor}'`);
    }

    if (!libVal.evalIsEmpty( EWMDeliveryNum )) {
        filters.push(`EWMDeliveryNum eq '${EWMDeliveryNum}'`); 
    }

    if (!libVal.evalIsEmpty( INBRefDocNumber )) {
        filters.push(`RefDocNum eq '${INBRefDocNumber}'`); 
    }

    const [StartDate,EndDate] = [PlannedDeliveryStartDate,PlannedDeliveryEndDate].map(date => new ODataDate(date));
    if (PlannedDeliveryDateRangeSwitch && !libVal.evalIsEmpty(StartDate) && !libVal.evalIsEmpty(EndDate)) {
        filters.push(`(PlannedDeliveryDate ge datetime'${StartDate.toDBDateTimeString(context)}' and PlannedDeliveryDate le datetime'${EndDate.toDBDateTimeString(context)}')`);
    }

    if (!libVal.evalIsEmpty( InboundDeliveryDoorNumber )) { 
        filters.push(`UnloadingPoint eq '${InboundDeliveryDoorNumber}'`); 
    }

    if (!libVal.evalIsEmpty( HUNumber )) { 
        filters.push(`HUNumber eq '${HUNumber}'`); 
    }

    return filters;
}

function getDirectSearchEWMInboundDeliveryFilters(context) {
   return [`EWMDeliveryNum eq '${context.searchString}'`, `WarehouseNum eq '${GetWarehouseNumber()}'`];
}
