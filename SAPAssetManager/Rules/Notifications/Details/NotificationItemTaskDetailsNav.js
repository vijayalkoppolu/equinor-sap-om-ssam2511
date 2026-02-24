import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';

export default function NotificationItemTaskDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();

    return NotificationItemTaskChangeStatusOptions(context, actionBinding).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, 'NotificationItemTaskDetailsPage').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/Item/NotificationItemTaskDetailsNav.action');
        });
    });
}

export function NotificationItemTaskChangeStatusOptions(context, binding, rereadStatus) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType);
    return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}
