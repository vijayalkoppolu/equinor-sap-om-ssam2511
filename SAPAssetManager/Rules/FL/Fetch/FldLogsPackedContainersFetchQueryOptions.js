import libVal from '../../Common/Library/ValidationLibrary';
import libCom from '../../Common/Library/CommonLibrary';

export default function FldLogsPackedContainersFetchQueryOptions(context) {
    const queryBuilder = context.dataQueryBuilder();
    const filtersArray = getFldLogsPackedContainersFilters(context).join(' and ');
    if (filtersArray) {
        queryBuilder.filter(`(${filtersArray})`);
    }
    return queryBuilder;
}

export function getFldLogsPackedContainersFilters(context) {
    const filters = [];
    const plant = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:PlantListPicker').getValue());
        const [packedContainersPlant,itemStatus] = [
            'FLPackedContainersPlantListPicker',
            'ContainerPackingStatus',
        ].map(control => libCom.getListPickerValue(context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue()));

        const [containerID] = [
            'FldLogsContainerID',
        ].map(control => context.evaluateTargetPath(`#Page:FLFetchDocuments/#Control:${control}`).getValue());

    if (!libVal.evalIsEmpty(plant)) {
        filters.push(`FldLogsDestPlnt eq '${plant}'`);
    }
    if (!libVal.evalIsEmpty(packedContainersPlant)) {
        filters.push(`FldLogsSrcePlnt eq '${packedContainersPlant}'`);
    }
    // If blank then show InPacking, Sealed and Unsealed statuses only
    filters.push(libVal.evalIsEmpty(itemStatus)
        ? '(FldLogsCtnPackgStsCode eq \'10\' or FldLogsCtnPackgStsCode eq \'20\' or FldLogsCtnPackgStsCode eq \'30\')'
        : `FldLogsCtnPackgStsCode eq '${itemStatus}'`,
    );
    if (!libVal.evalIsEmpty(containerID)) {
        filters.push(`FldLogsContainerID eq '${containerID}'`);
    }

    return filters;
}
