import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';

export default function NotificationTaskDetailsNav(context) {
    let pageProxy = context.getPageProxy();
    let actionBinding = pageProxy.getActionBinding();

    return NotificationTaskChangeStatusOptions(context, actionBinding).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, 'NotificationTaskDetailsPage').then(() => {
            return context.executeAction('/SAPAssetManager/Actions/Notifications/Task/NotificationTaskDetailsNav.action');
        });
    });
}

export function NotificationTaskChangeStatusOptions(context, binding, rereadStatus = false) {
    const objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/Task.global').getValue();
    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType);
    return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}
