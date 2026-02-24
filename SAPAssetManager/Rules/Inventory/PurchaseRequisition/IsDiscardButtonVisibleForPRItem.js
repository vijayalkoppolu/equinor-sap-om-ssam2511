import CommonLibrary from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function IsDiscardButtonVisibleForPRItem(context) {
    if (!CommonLibrary.IsOnCreate(context) && ODataLibrary.isLocal(context.binding)) {
        let purchaseReqNo = context.binding.PurchaseReqNo;
        let itemQueryOptions = `$filter=PurchaseReqNo eq '${purchaseReqNo}'`;

        return context.count('/SAPAssetManager/Services/AssetManager.service', 'PurchaseRequisitionItems', itemQueryOptions)
            .then(count => {
                return (count > 1); //Can only delete if not the last item
            });    
    }

    return Promise.resolve(false);
}
