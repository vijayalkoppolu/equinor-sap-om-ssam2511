import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';

export default async function GetNotificationItemStepData(context) {
    const itemLinks = WorkOrderCompletionLibrary.getStep(context, 'notification')?.itemLinks || [];
    const readLinks = itemLinks.reduce((linksAccumulator, link) => {
        if (link.startsWith('MyNotificationItems')) {
            linksAccumulator.notificationItemReadLink = link;
        } else if (link.startsWith('MyNotifItemLongTexts')) {
            linksAccumulator.notificationItemLongTextReadLink = link;
        } else if (link.startsWith('MyNotificationItemCauses')) {
            linksAccumulator.notificationCauseReadLink = link;
        } else if (link.startsWith('MyNotifItemCauseLongTexts')) {
            linksAccumulator.notificationCauseLongTextReadLink = link;
        }
        return linksAccumulator;
    }, {});

    const result = {};

    if (readLinks.notificationItemReadLink) {
        let item = await context.read('/SAPAssetManager/Services/AssetManager.service', readLinks.notificationItemReadLink, [], '');
        result.Item = item?.getItem(0) || {};
    }
    if (readLinks.notificationCauseReadLink) {
        let cause = await context.read('/SAPAssetManager/Services/AssetManager.service', readLinks.notificationCauseReadLink, [], '');
        result.Cause = cause?.getItem(0) || {};
    }
    if (readLinks.notificationCauseLongTextReadLink) {
        let causeLongText = await context.read('/SAPAssetManager/Services/AssetManager.service', readLinks.notificationCauseLongTextReadLink, [], '');
        result.CauseLongText = causeLongText?.getItem(0) || {};
    }
    if (readLinks.notificationItemLongTextReadLink) {
        let itemLongText = await context.read('/SAPAssetManager/Services/AssetManager.service', readLinks.notificationItemLongTextReadLink, [], '');
        result.ItemLongText = itemLongText?.getItem(0) || {};
    }

    return result;
}
