import libCom from '../../Common/Library/CommonLibrary';
import { DocumentTypes } from '../Common/EWMLibrary';
import { getEWMOrderFilters } from './EWMOrderFetchQueryOptions';
import { getEWMTaskFilters } from './EWMTaskFetchQueryOptions';
import { getEWMPhysicalInventoryFilters } from './EWMPhysicalInventoryFetchQueryOptions';
import { getEWMInboundDeliveryFilters } from './EWMInboundDeliveryFetchQueryOptions';

export default function EWMFetchQueryOptions(context, docType, directSearch = false) {
    const queryBuilder = context.dataQueryBuilder?.() || context.evaluateTargetPathForAPI('#Page:EWMFetchDocumentsPage').getControls()[0].dataQueryBuilder();
    const filtersArray = getQueryForFetchDocuments(context, docType, directSearch);
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray.join(' and ')})`);
    }
    
    return queryBuilder;
}

export function getQueryForFetchDocuments(context, docType, directSearch = false) {
    const documentType = docType || libCom.getListPickerValue(context.evaluateTargetPath('#Page:EWMFetchDocumentsPage/#Control:DocumentTypeListPicker').getValue());
    const filtersArray = [];

    switch (documentType) {
        case DocumentTypes.WarehouseOrder:
            filtersArray.push(...getEWMOrderFilters(context));
            break;
        case DocumentTypes.WarehouseTask:
            filtersArray.push(...getEWMTaskFilters(context));
            break;
        case DocumentTypes.WarehousePhysicalInventoryItem:
            filtersArray.push(...getEWMPhysicalInventoryFilters(context));
            break;
        case DocumentTypes.WarehouseInboundDelivery:
            filtersArray.push(...getEWMInboundDeliveryFilters(context, directSearch));
            break;
    }
    return filtersArray;
}
