import ODataLibrary from '../../OData/ODataLibrary';

/**
* Describe this function...
* @param {IClientAPI} context
*/
export default function ShowAccessoryButtonIcon(context) {
    const type = context.binding['@odata.type'].substring('#sap_mobile.'.length);
    // for other types contantly returning this icon
    if (type === 'PurchaseRequisitionHeader' || type === 'PurchaseRequisitionItem') {
        const isLocal = ODataLibrary.isLocal(context.binding);
        if (!isLocal) {
            return '';
        }
    }
    return '$(PLT, /SAPAssetManager/Images/edit-accessory.ios.png, /SAPAssetManager/Images/edit-accessory.android.png)';
}
