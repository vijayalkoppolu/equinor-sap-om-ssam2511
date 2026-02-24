import CommonLibrary from '../../../Common/Library/CommonLibrary';
import PurchaseRequisitionLibrary from '../PurchaseRequisitionLibrary';

export default function GetHeaderLink(context) {
    const isOnCreate = CommonLibrary.IsOnCreate(context); 
    const isAnotherCreate = PurchaseRequisitionLibrary.isAddAnother(context);
    const isCreateFromDetailsPage = PurchaseRequisitionLibrary.isCreateFromDetailsPage(context);

    if (isOnCreate && !isAnotherCreate && !isCreateFromDetailsPage) {
        return 'pending_1';
    }

    let purchaseReqNo = PurchaseRequisitionLibrary.getLocalHeaderId(context);
    if (context.binding?.PurchaseReqNo) {
        purchaseReqNo = context.binding.PurchaseReqNo;
    }
    return context.read('/SAPAssetManager/Services/AssetManager.service', `PurchaseRequisitionHeaders('${purchaseReqNo}')`, [], '').then(result => {
        if (result && result.length > 0) {
            return result.getItem(0)['@odata.readLink'];
        }
        return '';
    });
}
