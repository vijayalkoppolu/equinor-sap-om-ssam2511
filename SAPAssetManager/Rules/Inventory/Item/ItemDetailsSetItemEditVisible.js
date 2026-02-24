import libCom from '../../Common/Library/CommonLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

/**
 * Hide edit button for non-local data for PurchaseRequisitionDetailsPage
 * @param {IClientAPI} context 
 * @returns {boolean} 
 */
export default function ItemDetailsSetItemEditVisible(context) {
    const binding = context.binding;
    const type = binding?.['@odata.type'].substring('#sap_mobile.'.length);
    if (binding && libCom.getCurrentPageName(context) === 'PurchaseRequisItemsListPage') {
        if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
            return ODataLibrary.isLocal(context.binding);
        }
    } else if (binding && type === 'MaterialDocItem') {
        let query = `$filter=ReferenceDocHdr eq '${context.binding.MaterialDocNumber}' and ReferenceDocItem eq '${context.binding.MatDocItem}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'MaterialDocItems', ['EntryQuantity'], query).then(result => {
            const items = result?.slice() || [];
            const total = items.reduce((sum, item) => sum + item.EntryQuantity, 0);
            return total < context.binding.EntryQuantity;
        });
    }
    return true;
}
