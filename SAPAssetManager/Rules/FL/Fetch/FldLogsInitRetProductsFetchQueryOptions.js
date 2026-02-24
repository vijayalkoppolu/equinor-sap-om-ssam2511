import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { toODataDate } from './FldLogsReadyToPackFetchQueryOptions';

export default function FldLogsInitRetProductsFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getFldLogsInitRetProductsFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    return queryBuilder;
}

export function getFldLogsInitRetProductsFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
    const [returnStatus, supplyProcess, recommendedAction] = [
        'ReturnStatus',
        'SupplyProcess',
        'RecommendedAction',
    ].map(control => libCom.getListPickerValue(context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue()));
    
    const [referenceDocumentNumber,product, outboundDelivery] = [
    'ReferenceDocumentNumber',
    'Product',
    'OutboundDelivery',
    ].map(control => context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue());
    
    const dispatchPeriodSwitch = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DispatchPeriodSwitch').getValue();
    const dispatchedStartDate = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DispatchedStartDate').getValue();
    const dispatchedEndDate = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DispatchedEndDate').getValue();
    const requestedDeliveryDateSwitch = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:RequestedDeliveryDateSwitch').getValue();
    const requestedDeliveryDate = context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:RequestedDeliveryDate').getValue();

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`FldLogsRemotePlant eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(returnStatus)) {
        filters.push(`FldLogsReturnStatus eq '${returnStatus}'`);
    }
    if (!libVal.evalIsEmpty(supplyProcess)) {
        filters.push(`FldLogsSupplyProcess eq '${supplyProcess}'`);
    }
    if (!libVal.evalIsEmpty(recommendedAction)) {
        filters.push(`FldLogsRecommendedAction eq '${recommendedAction}'`);
    }
    if (!libVal.evalIsEmpty(referenceDocumentNumber)) {
        filters.push(`FldLogsReferenceDocumentNumber eq '${referenceDocumentNumber}'`);
    }
    if (!libVal.evalIsEmpty(product)) {
        filters.push(`Product eq '${product}'`);
    }
    if (!libVal.evalIsEmpty(outboundDelivery)) {
        filters.push(`OutboundDelivery eq '${outboundDelivery}'`);
    }
    if (dispatchPeriodSwitch) {
        if (!libVal.evalIsEmpty(dispatchedStartDate) && !libVal.evalIsEmpty(dispatchedEndDate)) {
            // Convert to OData format YYYY-MM-DDTHH:MM:SS
            const startDateOData = toODataDate(dispatchedStartDate);
            const endDateOData = toODataDate(dispatchedEndDate);
            if (startDateOData && endDateOData) {
                filters.push(`DispatchedStartDate ge datetime'${startDateOData}' and DispatchedStartDate le datetime'${endDateOData}'`);
            }
        }
    }
    if (requestedDeliveryDateSwitch && !libVal.evalIsEmpty(requestedDeliveryDate)) {
        // Convert to OData format YYYY-MM-DDTHH:MM:SS
        const reqDateOData = toODataDate(requestedDeliveryDate);
        if (reqDateOData) {
            filters.push(`RequestedShippingDate eq datetime'${reqDateOData}'`);
        }
    }
    return filters;
}
