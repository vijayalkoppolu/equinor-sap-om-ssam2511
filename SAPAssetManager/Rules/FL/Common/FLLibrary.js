import CommonLibrary from '../../Common/Library/CommonLibrary';
import ValidationLibrary from '../../Common/Library/ValidationLibrary';

export const VoyageStatus = Object.freeze({
    InTransit: '01',
    Arrived: '02',
    Completed: '03',
});

export const VoyageDownloadFiltersAllowed = Object.freeze({
    Arrived: '02',
    Completed: '03',
});

export const ContainerStatus = Object.freeze({
    Dispatched: '10',
    PartiallyReceived: '20',
    Received: '30',
    Unloaded: '40',
    Arrived: '50',
    NotFound: '60',
});

export const ReturnsByProductStatusText = Object.freeze({
    '10': 'fld_remote',
    '15': 'fld_return_draft',
    '20': 'fld_return_requested',
    '30': 'fld_return_scheduled',
    '40': 'fld_ready_for_dispatch',
    '50': 'fld_dispatched',
    '60': 'fld_received_at_base',
    '70': 'fld_transfer_scheduled',
});
export const ReadyToPackStatus = Object.freeze({
    AvailableForPacking: '10',
    HUItemDuplicate: '15',
    AssignedToContainer: '20',
    AssignedToPackage: '21',
    GoodsIssueInProgress: '25',
    ReadyForDispatch: '27',
    Dispatched: '30',
    ArrivedAtDestination: '40',
    Inactive: '90',
    MarkedForDeletion: '99',
});
export const ReadyToPackStatusText = Object.freeze({
    '10': 'fld_available_for_packing',
    '15': 'fld_hu_item_duplicate',
    '20': 'fld_assigned_to_container',
    '21': 'fld_assigned_to_package',
    '25': 'fld_goods_issue_in_progress',
    '27': 'fld_ready_for_dispatch',
    '30': 'fld_dispatched',
    '40': 'fld_arrived_at_destination',
    '90': 'fld_inactive',
    '99': 'fld_marked_for_deletion',
});
export const PackedPackagesTransStatus = Object.freeze({
    NotStarted: '10',
    GoodsIssueInProgress: '15',
    ReadyForDispatch: '17',
    Dispatched: '20',
    RepackingInProgress: '25',
    ArrivedAtDestination: '30',
});
export const PackedPackagesPackingStatus = Object.freeze({
    InPacking: '10',
    Sealed: '20',
    UnSealed: '30',
});

export const ContainerItemStatus = Object.freeze({
    Dispatched: '10',
    Arrived: '20',
    InProcess: '30',
    ReceiptInProcess: '35',
    Received: '40',
    Deleted: '50',
    Unloaded: '60',
    NotFound: '70',
    ReceivedForTransfer: '80',
});
export const ProductReturnStatus = Object.freeze({
    AtRemote: '10',
    ReturnDraft: '15',
    ReturnRequested: '20',
    ReturnScheduled: '30',
    ReadyForDispatch: '40',
    Dispatched: '50',
});
export const FldLogsWoResvItemStatus = Object.freeze({
    Open: '',
    Returned: 'R',
});
export const FldLogsWOProductStatus = Object.freeze({
    Open: '',
    Returned: 'R',
});
export const FldWorkOrderStatus = Object.freeze({
    Open: '',
    Returned: 'R',
});
export const HUDelItemsDownloadAllowedStatus = Object.freeze({
    Dispatched: '10',
    Arrived: '20',
    InProcess: '30',
    ReceiptInProcess: '35',
    Unloaded: '60',
});

export const FLDefiningRequestsLite = Object.freeze([
    'FldLogsVoyages',
    'FldLogsVoyageMasters',
    'FldLogsContainers',
    'FldLogsContainerItems',
    'FldLogsPackages',
    'FldLogsPackageItems',
    'FldLogsHuDelItems',
    'FldLogsWorkOrders',
    'FldLogsWoProducts',
    'FldLogsWoResvItems',
    'FldLogsInitRetProducts',
    'FldLogsReturnStatuses',
    'FldLogsRecommendedActions',
    'FldLogsPackCtnRdyPcks',
    'FldLogsSupprocs',
    'FldLogsContainerItemSrNos',
    'FldLogsPackageItemSrNos',
    'FldLogsHuDelSnItems',
    'FldLogsPackCtnPkdPkgs',
    'FldLogsPackCtnPkdCtns',
    'MaterialUOMs',
    'MaterialValuations',
    'MaterialBatchStockSet',
    'FldLogsPackCtnRdyPckSrNos',
    'FldLogsPackCtnRdyPckVygs',
    'FldLogsPackCtnPkgVygs',
    'FldLogsPackCtnPkgItems',
    'FldLogsPackCtnContainerPkgs',
    'FldLogsPackCtnContainerVygs',
    'FldLogsPackCtnContainerItems',
    'FldLogsCtnPackageIds',
]);

export const FLEntitySetNames = Object.freeze({
    Container: 'FldLogsContainers',
    ContainerItem: 'FldLogsContainerItems',
    Package: 'FldLogsPackages',
    PackageItem: 'FldLogsPackageItems',
    HuDelItem: 'FldLogsHuDelItems',
    HuDelItemSerialNos : 'FldLogsHuDelSnItems',
    PackageItemSerialNos : 'FldLogsPackageItemSrNos',
    ContainerItemSerialNos : 'FldLogsContainerItemSrNos',
});
export const FLEntityNames = Object.freeze({
    WoProduct: 'FldLogsWoProduct',
    WoResvItem: 'FldLogsWoResvItem',
});

export const FLTypeEntitySetMap = Object.freeze({
    FldLogsContainer: FLEntitySetNames.ContainerItem,
    FldLogsPackage: FLEntitySetNames.PackageItem,
});

export const FLDocumentTypeValues = Object.freeze({
    Voyage: 'VOY',
    Container: 'CTN',
    Package: 'PKG',
    HandlingUnit: 'HU',
    DeliveryItem: 'DI',
    HandlingUnitDeliveryItem: 'HDI',
    WorkNetworkOrder: 'WNO',
    ReturnsByProduct: 'RTP',
    ReadyToPack: 'PCT',
    PackedPackages: 'PPKG',
    PackedContainers: 'PCTN',
});

export function appendVoyageNumberForContainerorHUDelItemFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = ` and (VoyageNumber eq '${context.binding.VoyageNumber}')`;
        return currentFilter + voyageNumberFilter;
    }
    return currentFilter;
}

export function appendVoyageNumberForPackagesFilter(currentFilter, context) {
    if (context.binding?.VoyageNumber) {
        let voyageNumberFilter = `(VoyageNumber eq '${context.binding.VoyageNumber}')`;
        // Adding condition to exclude packages with ParentCtnId
        let excludeParentCtnIdFilter = '(ParentCtnID eq null or ParentCtnID eq \'\')';
        return `${currentFilter} and (${voyageNumberFilter} and ${excludeParentCtnIdFilter})`;
    }
    return currentFilter;
}

export function appendContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ContainerID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export function appendParentContainerIDFilter(currentFilter, context) {
    if (context.binding?.ContainerID) {
        let containerIDFilter = ` and (ParentCtnID eq '${context.binding.ContainerID}')`;
        return currentFilter + containerIDFilter;
    }
    return currentFilter;
}

export default class {

    static getVoyageNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Voyages/VoyageDetailsPageNav.action',
            entitySet: 'FldLogsVoyages',
            expandOptions: '$expand=FldLogsVoyageStatus_Nav, FldLogsVoyageType_Nav',
        };
    }

    static getContainerNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Containers/ContainersDetailsPageNav.action',
            entitySet: 'FldLogsContainers',
            expandOptions: '$expand=FldLogsContainerStatus_Nav, FldLogsContainerItem_Nav, FldLogsPackage_Nav',
        };
    }

    static getPackageNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/Packages/PackageDetailsPageNav.action',
            entitySet: 'FldLogsPackages',
            expandOptions: '$expand=FldLogsContainerStatus_Nav, FldLogsPackageItem_Nav',
        };
    }

    static getHuDelItemNavOptions() {
        return {
            navAction: '/SAPAssetManager/Actions/FL/HUDelItems/HUDelItemsDetailsPageNav.action',
            entitySet: 'FldLogsHuDelItems',
            expandOptions: '$expand=FldLogsHUDelItemStatus_Nav, FldLogsHandlingDecision_Nav, FldLogsPackagingType_Nav',
        };
    }

    static getNavigationObjectMap() {
        return {
            'FldLogsVoyages'   : this.getVoyageNavOptions(),
            'FldLogsContainers': this.getContainerNavOptions(),
            'FldLogsPackages'  : this.getPackageNavOptions(),
            'FldLogsHuDelItems': this.getHuDelItemNavOptions(),
        };
    }

    /**
     * Opens document details page for the FL Persona
     */
    static openDocumentDetailsPage(context, entitySet, queryOptions, navAction, pageName) {
        return context.read('/SAPAssetManager/Services/AssetManager.service', entitySet, [], queryOptions).then(data => {
            if (data.length === 1) {
                let page = '';
                if (pageName === 'VoyagesListPage') {
                    page = context.evaluateTargetPathForAPI('#Page:VoyagesListPage');
                } else {
                    page = context.evaluateTargetPathForAPI('#Page:FLOverviewPage');
                }
                const docInfo = data.getItem(0);
                page.setActionBinding(docInfo);
                return page.executeAction(navAction);
            }
            return false;
        });
    }

    static getEntitySetForDocumentType(documentType) {
        switch (documentType) {
            case FLDocumentTypeValues.Voyage:
                return 'FldLogsVoyages';
            case FLDocumentTypeValues.Container:
                return 'FldLogsContainers';
            case FLDocumentTypeValues.Package:
                return 'FldLogsPackages';
            case FLDocumentTypeValues.WorkNetworkOrder:
                return 'FldLogsWorkOrders';
            case FLDocumentTypeValues.ReturnsByProduct:
                return 'FldLogsInitRetProducts';
            case FLDocumentTypeValues.ReadyToPack:
                return 'FldLogsPackCtnRdyPcks';
            case FLDocumentTypeValues.HandlingUnit:
            case FLDocumentTypeValues.DeliveryItem:
                return 'FldLogsHuDelItems';
            case FLDocumentTypeValues.PackedPackages:
                return 'FldLogsPackCtnPkdPkgs';
            case FLDocumentTypeValues.PackedContainers:
                return 'FldLogsPackCtnPkdCtns';
            default:
                return '';
        }
    }

    static getDocumentData(item, documentType) {
        const document = { FLObject: documentType };
        switch (documentType) {
            case FLDocumentTypeValues.Voyage:
                document.ObjectId = item.VoyageStageUUID;
                break;
            case FLDocumentTypeValues.Container:
                document.ObjectId = item.ContainerID;
                break;
            case FLDocumentTypeValues.Package:
                document.ObjectId = item.ContainerID;
                break;
            case FLDocumentTypeValues.WorkNetworkOrder:
                document.ObjectId = item.ObjectId;
                break;
            case FLDocumentTypeValues.ReturnsByProduct:
                document.ObjectId = item.ObjectId;
                break;
            case FLDocumentTypeValues.ReadyToPack:
                document.ObjectId = item.ObjectId;
                break;
            case FLDocumentTypeValues.PackedPackages:
                document.ObjectId = item.ObjectId;
                break;
            case FLDocumentTypeValues.PackedContainers:
                document.ObjectId = item.ObjectId;
                break;
            case FLDocumentTypeValues.HandlingUnit:
            case FLDocumentTypeValues.DeliveryItem:
            case FLDocumentTypeValues.HandlingUnitDeliveryItem:
                {
                    document.FLObject = FLDocumentTypeValues.HandlingUnitDeliveryItem;
                    document.DispatchDate = item.DispatchDate;
                    const date = new Date(item.DispatchDate);
                    const [year, month, day] = [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')];
                    document.ObjectId = `${item.DispatchLoc}${year}${month}${day}${item.ReferenceDocNumber}`;
                }
                break;
        }
        return document;
    }

    static isFetchOnlineSectionVisible(context, sectionType) {
        const documentType = CommonLibrary.getListPickerValue(context.evaluateTargetPath('#Page:FLFetchDocuments/#Control:DocumentTypeListPicker').getValue());
        return documentType === sectionType;
    }

    static navigateOnSearchStringMatch(context, entitySet, query) {
        const navObject = this.getNavigationObjectMap()[entitySet];
        return CommonLibrary.navigateOnRead(context.getPageProxy(), navObject.navAction, navObject.entitySet, `${query}&${navObject.expandOptions}`);
    }

    static isLastQueryForMatch(clientData) {
        return Object.values(clientData).filter(x => x === null).length === 0;
    }
    static isOnlyOneMatch(clientData) {
        return Object.values(clientData).filter(x => x.count > 0).length === 1;
    }
    static onOverviewPageSectionLoad(context, queryBuilder, filterQuery, entitySet, topValue) {
        queryBuilder.top(topValue);
        const searchString = context.searchString?.toLowerCase();
        const autoOpenEnabled = (CommonLibrary.getAppParam(context, 'FL', 'search.auto.navigate') === 'Y');
        if (searchString && autoOpenEnabled) {
            const entityName = entitySet;
            return context.count('/SAPAssetManager/Services/AssetManager.service', entitySet, filterQuery)
                    .then((count) => {
                        const clientData = context.getClientData();
                        if (ValidationLibrary.evalIsEmpty(clientData[searchString])) {
                            clientData[searchString] = {
                                'FldLogsVoyages' : null,
                                'FldLogsPackages': null,
                                'FldLogsContainers': null,
                                'FldLogsHuDelItems': null,
                            };
                        }
                        clientData[searchString][entityName] = {
                            count: count,
                            query: filterQuery,
                        };
                        
                        if (this.isLastQueryForMatch(clientData[searchString])) {
                            if (this.isOnlyOneMatch(clientData[searchString])) {
                                const navObject = Array.from(Object.entries(clientData[searchString])).reduce((acc, [key, value]) => {
                                    if (value.count === 1) {
                                      acc[key] = value;
                                    }
                                    return acc;
                                  }, {});
                                clientData[searchString] = undefined;
                                return this.navigateOnSearchStringMatch(context, Object.keys(navObject)[0], Object.values(navObject)[0].query);
                            }
                            clientData[searchString] = undefined;
                        }
                        return queryBuilder;
                    });
        }
        return queryBuilder;
    }

}


export function getPlantNameFL(clientAPI, plantId) {  
        const queryOptions = "$filter=Plant eq '" + plantId + "'"; 
        return clientAPI.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsPlants', [], queryOptions).then((result) => {
 
            if (result?.length > 0) { 
                return result.getItem(0).Plant + ' - ' + result.getItem(0).PlantName; 
            } 
            return plantId; 
        }); 
    }

export function redrawFilter(sectionTableName,objectTableName,pageProxy) {
    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const sectionedTableProxy = pageProxy.getControl?.(sectionTableName);
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection(objectTableName);
    if (section) {
        section.redraw(true);
    }

    return sectionedTableProxy.redraw().then(() => {
        return Promise.resolve();
    }); 
}
