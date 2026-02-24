import ODataLibrary from '../../OData/ODataLibrary';
import isAndroid from '../../Common/IsAndroid';
import { GetAttachmentIcon } from '../Overview/MaterialDocumentIcon';

export default async function ProductionOrderListViewIconImages(context) {
    let iconImage = [];
    let binding = context.getBindingObject();
    if (ODataLibrary.hasAnyPendingChanges(binding)) {
        iconImage.push(isAndroid(context) ? '/SAPAssetManager/Images/syncOnListIcon.android.png' : '/SAPAssetManager/Images/syncOnListIcon.png');
    }

    const attachmentIcon = await GetAttachmentIcon(context, context.binding);
    if (attachmentIcon && (ODataLibrary.hasAnyPendingChanges(binding))) {
        iconImage.push(attachmentIcon);
    }

    return iconImage;
}
