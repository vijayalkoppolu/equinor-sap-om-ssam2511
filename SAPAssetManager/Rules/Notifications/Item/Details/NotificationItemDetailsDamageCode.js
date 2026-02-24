import ValidationLibrary from '../../../Common/Library/ValidationLibrary';

export default function NotificationItemDetailsDamageCode(context) {
    if (ValidationLibrary.evalIsEmpty(context.binding?.DamageCode)) {
        return Promise.resolve('-');
    }
    const notificationItem = context.binding;
    return getDefectTypeFrom(context, notificationItem)
        .then(defectType => defectType && context.read('/SAPAssetManager/Services/AssetManager.service', `PMCatalogCodes(Catalog='${defectType}',CodeGroup='${notificationItem.CodeGroup}',Code='${notificationItem.DamageCode}')`, [], ''))
        .then(pmCatCodes => ValidationLibrary.evalIsEmpty(pmCatCodes) ? notificationItem.DamageCode :  `${notificationItem.DamageCode} - ${pmCatCodes.getItem(0).CodeDescription}`)
        .catch(() => notificationItem.DamageCode);
}

export function getDefectTypeFrom(context, notificationItem) {
    return Promise.resolve(notificationItem.DefectType || context.read('/SAPAssetManager/Services/AssetManager.service', `NotificationTypes('${notificationItem.Notification.NotificationType}')`, ['CatTypeDefects'], '').then(ntypes => ntypes.getItem(0).CatTypeDefects));
}
