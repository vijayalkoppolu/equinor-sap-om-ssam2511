import libMobile from '../../MobileStatus/MobileStatusLibrary';
import NotificationMobileStatus from '../MobileStatus/NotificationMobileStatusLibrary';

export default class {

    static readTaskMobileStatus(context) {
        let msLink = 'TaskMobileStatus_Nav';
        if (context.binding['@odata.type'] === '#sap_mobile.MyNotificationTask') {
            msLink = 'ItemTaskMobileStatus_Nav';
        }
        return context.read('/SAPAssetManager/Services/AssetManager.service', context.binding['@odata.readLink'], [], `$expand=${msLink}&$select=${msLink}/MobileStatus`).then(status => {
            if (status) {
                const taskMobileStatus = status.getItem(0);
                return taskMobileStatus.TaskMobileStatus_Nav.MobileStatus;
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


    static getMobileStatus(context) {
        return libMobile.getMobileStatus(context.binding, context);
    }
}
