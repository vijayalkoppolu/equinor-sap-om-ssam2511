import CommonLibrary from '../../Common/Library/CommonLibrary';
import DocumentsBDSCount from '../../Documents/Count/DocumentsBDSCount';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';
import S4ErrorsLibrary from '../../S4Errors/S4ErrorsLibrary';
import ODataLibrary from '../../OData/ODataLibrary';

export default function ServiceOrderListViewIconImages(context) {
    let binding = context.getBindingObject();
    let iconImage = [];
    const serviceItems = binding.ServiceItems_Nav;

    // check if this order requires sync
    if (ODataLibrary.hasAnyPendingChanges(binding) || ODataLibrary.hasAnyPendingChanges(binding.MobileStatus_Nav)) {
        iconImage.push(CommonLibrary.GetSyncIcon(context));
    }

    if (serviceItems && serviceItems.length > 0 && !iconImage.length) {
        serviceItems.forEach(item => {
            if (ODataLibrary.hasAnyPendingChanges(item) && !iconImage.length) {
                iconImage.push(CommonLibrary.GetSyncIcon(context));
            }
        });
    }

    if (S4ErrorsLibrary.isS4ObjectHasErrorsInBinding(context)) {
        iconImage.push(CommonLibrary.GetS4ErrorIcon(context));
    }

    // check if this item has any docs
    return DocumentsBDSCount(context, binding).then(res => {
        if (res) {
            const docIcon = AttachedDocumentIcon(context, undefined, res);
            if (docIcon) {
                iconImage.push(docIcon);
            }
        }
        return iconImage;
    }).catch(() => {
        return iconImage;
    });
}
