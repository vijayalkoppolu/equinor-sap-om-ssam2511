import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function FldLogsReadyToPackFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getFldLogsReadyToPackFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    return queryBuilder;
}

export function getFldLogsReadyToPackFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
        const [readyToPackPlant,itemStatus] = [
            'FLReadyToPackPlantListPicker',
            'ItemStatus',
        ].map(control => libCom.getListPickerValue(context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue()));
        
        const [deliveryDocument,handlingUnit] = [
        'DeliveryDocument',
        'HandlingUnitExternalId',
        ].map(control => context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue());
    
        const deliveryDueDateSwitch = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DeliveryDueDateSwitch').getValue();
        const deliveryDueDateStartDate = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DeliveryDueDateStartDate').getValue();
        const deliveryDueDateEndDate = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DeliveryDueDateEndDate').getValue();

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`FldLogsDestPlnt eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(readyToPackPlant)) {
        filters.push(`FldLogsSrcePlnt eq '${readyToPackPlant}'`);
    }
    // If blank then show available for packing, ready for dispatch, dispatched
    filters.push(libVal.evalIsEmpty(itemStatus)
        ? '(FldLogsShptItmStsCode eq \'10\' or FldLogsShptItmStsCode eq \'27\' or FldLogsShptItmStsCode eq \'30\')'
        : `FldLogsShptItmStsCode eq '${itemStatus}'`,
    );
    if (!libVal.evalIsEmpty(handlingUnit)) {
        filters.push(`HandlingUnitExternalId eq '${handlingUnit}'`);
    }
    if (!libVal.evalIsEmpty(deliveryDocument)) {
        filters.push(`DeliveryDocument eq '${deliveryDocument}'`);
    }
    if (deliveryDueDateSwitch) {
        if (!libVal.evalIsEmpty(deliveryDueDateStartDate) && !libVal.evalIsEmpty(deliveryDueDateEndDate)) {
            // Convert to OData format YYYY-MM-DDTHH:MM:SS
            const startDateOData = toODataDate(deliveryDueDateStartDate);
            const endDateOData = toODataDate(deliveryDueDateEndDate);
            if (startDateOData && endDateOData) {
                filters.push(`FldLogsDelivDueDate ge datetime'${startDateOData}' and FldLogsDelivDueDate le datetime'${endDateOData}'`);
            }
        }
    }
    return filters;
}

export function toODataDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}`;
}
