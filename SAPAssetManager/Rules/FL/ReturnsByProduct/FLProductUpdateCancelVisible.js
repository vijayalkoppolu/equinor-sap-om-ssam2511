import CommonLibrary from '../../Common/Library/CommonLibrary';
export default function FLProductUpdateCancelVisible(clientAPI) {
    switch (CommonLibrary.getCurrentPageName(clientAPI)) {
        case 'FLPBulkWOUpdate':
            return false;
        case 'FLBulkWOUpdate':
            return false;
        case 'BulkFLReadyToPackEdit':
            return false;
        case 'FLPPKGBulkUpdate':
            return false;
        case 'BulkFLPackContainerEdit':
            return false;
        case 'FLReturnsbyProductListViewPage':
            return true;
        case 'FLWorkOrdersListViewPage':
            return true;
        case 'FLPInitiateReturnPage':
            return true;
        case 'FLPUpdatePickQuantityPage':
            return true;
        case 'FLOProductReturnStock':
            return true;
        case 'FLResvItemReturnStock':
            return true;
        case 'FLEditReadyToPackItem':
            return true;
        case 'FLEditPackedPackage':
            return true;
        case 'EditPackContainer':
            return true;
        case 'EditPackedPackage':
            return true;
        case 'EditReadyToPackItem':
            return true;
        default:
            return false;
    }
}
