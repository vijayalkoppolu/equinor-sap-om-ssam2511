import ODataLibrary from '../../OData/ODataLibrary';
import isAndroid from '../../Common/IsAndroid';
import AttachedDocumentIcon from '../../Documents/AttachedDocumentIcon';

export default function InspectionLotIcons(context) {
    const iconImage = [];
    let isLocal = false;
    let binding = context.getBindingObject();
     
    const docsIcon = AttachedDocumentIcon(context, context.binding.InspectionLot_Nav.InspectionLotDocument_Nav);
    if (docsIcon) {
        iconImage.push(docsIcon);
    }

    // check if this checlist requires sync
    if (ODataLibrary.hasAnyPendingChanges(binding) || ODataLibrary.hasAnyPendingChanges(binding.InspectionLot_Nav)) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
        isLocal = true;
    }

    if (!isLocal) {
        return context.count('/SAPAssetManager/Services/AssetManager.service', `${context.binding['@odata.readLink']}/InspectionChar_Nav`, '$filter=sap.hasPendingChanges()').then(count => {
            if (count > 0) {
                iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
            }
            return iconImage;
        });
    }
    return iconImage;
}
