import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function FldLogsPackedPackagesFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getFldLogsPackedPackagesFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    return queryBuilder;
}

export function getFldLogsPackedPackagesFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
        const [readyToPackPlant, itemStatusInput] = [
            'FLPackPackagePlantListPicker',
            'PKGItemStatus',
        ].map(control => libCom.getListPickerValue(context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue()));
    
    // Default itemStatus to InPacking if blank
    const itemStatus = libVal.evalIsEmpty(itemStatusInput) ? '10' : itemStatusInput;
    
    const [containerPackageID] = [
            'FLContainerID',
        ].map(control => context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue());
    

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`FldLogsDestPlnt eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(readyToPackPlant)) {
        filters.push(`FldLogsDestPlnt eq '${readyToPackPlant}'`);
    }
    if (!libVal.evalIsEmpty(containerPackageID)) {
        filters.push(`FldLogsContainerID eq '${containerPackageID}'`);
    }
    if (!libVal.evalIsEmpty(itemStatus)) {
        filters.push(`FldLogsCtnPackgStsCode eq '${itemStatus}'`);
    }
    
    return filters;
}
