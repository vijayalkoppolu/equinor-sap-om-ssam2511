import pageToolbar from '../../Common/DetailsPageToolbar/DetailsPageToolbarClass';
import libCommon from '../../Common/Library/CommonLibrary';
import NotificationChangeStatusOptions from '../MobileStatus/NotificationChangeStatusOptions';
import NotificationDetailsNavQueryOptions from './NotificationDetailsNavQueryOptions';
import Logger from '../../Log/Logger';
import { NotificationDetailsPageName } from './NotificationDetailsPageToOpen';
import NotificationLibrary from '../NotificationLibrary';
import TelemetryLibrary from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';

export default function NotificationDetailsNav(context, isNavFromOnlinePage) {
    const navAction = '/SAPAssetManager/Actions/Notifications/NotificationDetailsNav.action';
    let pageProxy = context.getPageProxy();
    let bindingOriginal = pageProxy.binding;
    let actionBinding = pageProxy.getActionBinding();
    let isFollowOn = false;

    if (actionBinding['@odata.type'] === '#sap_mobile.NotificationHistory') {
        actionBinding = actionBinding.NotificationHeader_Nav;
        isFollowOn = true;
    }

    return NotificationChangeStatusOptions(pageProxy, actionBinding).then(items => {
        return pageToolbar.getInstance().saveToolbarItems(pageProxy, items, NotificationDetailsPageName(context)).then(() => {
            if (isNavFromOnlinePage) {
                return libCommon.sleep(500).then(() => { 
                    const newContext = context.getPageProxy()?.evaluateTargetPathForAPI('#Page:-Previous') ?? context;
                    return navigateToDetailsOnRead(newContext, navAction, actionBinding.NotificationNumber); 
                });
            }
            if (isFollowOn) {
                return navigateToDetailsOnRead(context, navAction, actionBinding.NotificationNumber); 
            }
            return NotificationLibrary.isServiceNotification(context).then((isServiceNotification) => {
                return TelemetryLibrary.executeActionWithLogPageEvent(context, navAction,
                    context.getGlobalDefinition(isServiceNotification ?
                        '/SAPAssetManager/Globals/Features/CSNotifications.global' : 
                        '/SAPAssetManager/Globals/Features/PMNotifications.global').getValue(),
                    TelemetryLibrary.PAGE_TYPE_DETAIL);
            });
        });
    }).catch(error => {
        pageProxy._context.binding = bindingOriginal;
        Logger.error(pageProxy.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
        return pageProxy.executeAction(navAction);
    });
}

export function navigateToDetailsOnRead(context, navAction, notifID) {
    const query = NotificationDetailsNavQueryOptions(context);
    return libCommon.navigateOnRead(context, navAction, `MyNotificationHeaders('${notifID}')`, query);
}
