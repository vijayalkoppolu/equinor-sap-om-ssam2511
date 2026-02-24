import libMobile from '../../../MobileStatus/MobileStatusLibrary';
import Logger from '../../../Log/Logger';
import NotificationMobileStatus from '../../../Notifications/MobileStatus/NotificationMobileStatusLibrary';
import { NotificationDetailsPageName } from '../../Details/NotificationDetailsPageToOpen';

export default class {

    static getMobileStatus(context) {
        return new Promise((resolve, reject) => {
            try {
                resolve(libMobile.getMobileStatus(context.binding, context));
            } catch (error) {
                /**Implementing our Logger class*/
                Logger.error(context.getGlobalDefinition('/SAPAssetManager/Globals/Logs/CategoryNotifications.global').getValue(), error);
                reject('');
            }
        });
    }

    static readTaskMobileStatus(context) {
        let link = '';

        if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            link = '/TaskMobileStatus_Nav';
        } else {
            link = '/ItemTaskMobileStatus_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'] + link, [], '$select=MobileStatus').then(status => {
            if (status) {
                let taskMobileStatus = status.getItem(0);
                return taskMobileStatus.MobileStatus;
            } else {
                return '';
            }
        });
    }

    static readHeaderMobileStatus(context) {
        return NotificationMobileStatus.getHeaderMobileStatus(context).then(status => {
            return status;
        });
    }

    static getHeaderMobileStatus(context) {
        let pageContext = libMobile.getPageContext(context, NotificationDetailsPageName(context));
        return this.getMobileStatus(pageContext);
    }
}
