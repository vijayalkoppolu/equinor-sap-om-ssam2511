import libCom from '../../Common/Library/CommonLibrary';
import { getVoyageFilters } from './VoyageFetchQueryOptions';
import { getContainerFilters } from './ContainerOrPackageFetchQueryOptions';
import { getHUDelItemsFilters } from './HUDelItemsFetchQueryOptions';
import { getFldLogsWorkOrdersFilters } from './FldLogsWorkOrdersFetchQueryOptions';
import { getFldLogsInitRetProductsFilters } from './FldLogsInitRetProductsFetchQueryOptions';
import { getFldLogsReadyToPackFilters } from './FldLogsReadyToPackFetchQueryOptions';
import { getFldLogsPackedPackagesFilters } from './FldLogsPackedPackagesFetchQueryOptions';
import { getFldLogsPackedContainersFilters } from './FldLogsPackedContainersFetchQueryOptions';
import { FLDocumentTypeValues } from '../Common/FLLibrary';

export default function FLFetchQueryOptions(context) {
    const queryBuilder = context.evaluateTargetPathForAPI('#Page:FLOverviewPage').getControls()[0].dataQueryBuilder();
    const filtersArray = getQueryForFetchDocuments(context);
    if (filtersArray.length > 0) {
        queryBuilder.filter('(' + filtersArray.join(' and ') + ')');
    }
    return queryBuilder;
}

export function getQueryForFetchDocuments(context) {
    const documentType = libCom.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
    const filtersArray = [];
    switch (documentType) {
        case FLDocumentTypeValues.Voyage:
            filtersArray.push(...getVoyageFilters(context));
            break;
        case FLDocumentTypeValues.Container:
        case FLDocumentTypeValues.Package:
            filtersArray.push(...getContainerFilters(context));
            break;
        case FLDocumentTypeValues.WorkNetworkOrder:
            filtersArray.push(...getFldLogsWorkOrdersFilters(context));
            break;
        case FLDocumentTypeValues.ReturnsByProduct:
            filtersArray.push(...getFldLogsInitRetProductsFilters(context));
            break;
        case FLDocumentTypeValues.ReadyToPack:
            filtersArray.push(...getFldLogsReadyToPackFilters(context));
            break;
        case FLDocumentTypeValues.HandlingUnit:
        case FLDocumentTypeValues.DeliveryItem:
            filtersArray.push(...getHUDelItemsFilters(context));
            break;
        case FLDocumentTypeValues.PackedPackages:
            filtersArray.push(...getFldLogsPackedPackagesFilters(context));
            break;
        case FLDocumentTypeValues.PackedContainers:
            filtersArray.push(...getFldLogsPackedContainersFilters(context));
            break;
    }
    return filtersArray;
}

