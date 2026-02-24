import ODataDate from '../../Common/Date/ODataDate';
import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';
import { HUDelItemsDownloadAllowedStatus, FLDocumentTypeValues } from '../Common/FLLibrary';

export default function HUDelItemsFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getHUDelItemsFilters(context).join(' and ');
    queryBuilder.filter(`(${filtersArray})`);
    return queryBuilder;
}


export function getHUDelItemsFilters(context) {
    const filters = [];
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
    const [workOrdMaintOrd, product, wbsElementProject, kitID, handlingUnit, referenceDocNumber, voyageNumber,  dispatchDateSwitch, startDispatchDate, endDispatchDate, receivingPoint] = ['HUDelItemsWorkOrdMaintOrd', 'HUDelItemsProduct', 'HUDelItemsWBSElementProject', 'HUDelItemsKitID', 'HandlingUnit', 'ReferenceDocNumber', 'HUDelItemsVoyageNumber', 'HUDelItemsDispatchDateSwitch', 'HUDelItemsStartDateFilter', 'HUDelItemsEndDateFilter', 'HUDelItemsReceivingPoint'].map(control => {
        return context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue();
    });
    filters.push(`IsDeliveryItem eq ${documentType === FLDocumentTypeValues.DeliveryItem}`);
    const [startDate, endDate] = [startDispatchDate, endDispatchDate].map(date => new ODataDate(date));
    const huDelItemsStatus = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:HUDelItemsStatus').getValue());
    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`ReceivingPlant eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(handlingUnit)) {
        filters.push(`HandlingUnitID eq '${handlingUnit}'`);
    } 
    if (!libVal.evalIsEmpty(referenceDocNumber)) {
        filters.push(`ReferenceDocNumber eq '${referenceDocNumber}'`);
    } 
    if (!libVal.evalIsEmpty(huDelItemsStatus)) {
        filters.push(`ContainerItemStatus eq '${huDelItemsStatus}'`);
    } else {
        //Add default filter
        const statusFilter = Object.values(HUDelItemsDownloadAllowedStatus).map(status => `ContainerItemStatus eq '${status}'`).join(' or ');
        filters.push(`(${statusFilter})`); 
    }
    if (!libVal.evalIsEmpty(voyageNumber)) {
        filters.push(`VoyageNumber eq '${voyageNumber}'`);
    }
    if (dispatchDateSwitch && !libVal.evalIsEmpty(startDate) && !libVal.evalIsEmpty(endDate)) {
        filters.push(`(DispatchDate ge datetime'${startDate.toDBDateString(context)}' and DispatchDate le datetime'${endDate.toDBDateString(context)}')`);
    }
    if (!libVal.evalIsEmpty(receivingPoint)) {
        filters.push(`ReceivingPoint eq '${receivingPoint}'`);
    }
    if (!libVal.evalIsEmpty(wbsElementProject)) {
        filters.push(`WBSElementExternalID eq '${wbsElementProject}'`);
    }
    if (!libVal.evalIsEmpty(kitID)) {
        filters.push(`KitIdentifier eq '${kitID}'`);
    }
    if (!libVal.evalIsEmpty(workOrdMaintOrd)) {
        filters.push(`MaintenanceOrder eq '${workOrdMaintOrd}'`);
    }
    if (!libVal.evalIsEmpty(product)) {
        filters.push(`Material eq '${product}'`);
    }
    return filters;
}

