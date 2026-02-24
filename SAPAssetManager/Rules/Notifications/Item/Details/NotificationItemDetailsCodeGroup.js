import ValidationLibrary from '../../../Common/Library/ValidationLibrary';
import { getDefectTypeFrom } from './NotificationItemDetailsDamageCode';

export default function NotificationItemDetailsCodeGroup(context) {
    if (ValidationLibrary.evalIsEmpty(context.binding?.CodeGroup)) {
        return Promise.resolve('-');
    }
    const notificationItem = context.binding;
    return getDefectTypeFrom(context, notificationItem)
        .then(defectType => defectType && context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${defectType}',CodeGroup='${notificationItem.CodeGroup}',Code='${notificationItem.DamageCode}')`, [], ''))
        .then(pmCatCodes => ValidationLibrary.evalIsEmpty(pmCatCodes) ? notificationItem.CodeGroup :  `${notificationItem.CodeGroup} - ${pmCatCodes.getItem(0).CodeGroupDesc}`)
        .catch(() => notificationItem.CodeGroup);
}
