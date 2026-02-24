import libCom from '../../Common/Library/CommonLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import { GetNotificationTypes } from '../../Common/CacheMobileStatusSeqs';

export default class NotificationTaskMobileStatusHelper {

    /**
     * 
     * @param {IPageProxy} context 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._objectType = objectType;
        this._currentStatus = currentStatus;
    }
    
    /**
     * Returns if Success status is visible for item
     * @returns {boolean}
     */
    isSuccessStatusVisible() {
        return libCom.isAppParameterEnabled(this._context, 'NOTIFICATION', 'TaskSuccess');
    }

    /**
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        const { STARTED } = libMobile.getMobileStatusValueConstants(this._context);
        const headerMobileStatus = libMobile.getMobileStatus(this._binding?.Notification || this._binding?.Item?.Notification, this._context);
        
        return headerMobileStatus === STARTED;
    }

    /**
     * Gets status options for current object
     * @returns {string}
     */
    getEAMOverallStatusProfile() {
        let notifType = '';
        if (this._binding?.Notification?.NotificationType) {
            notifType =  this._binding.Notification.NotificationType;
        } else if (this._binding?.Item?.Notification?.NotificationType) {
            notifType = this._binding.Item.Notification.NotificationType;
        }
        if (notifType) {
            const notificationType = GetNotificationTypes(this._context).find(notifTypeRow => notifType === notifTypeRow.NotifType);
            if (notificationType) {
                return notificationType.EAMOverallStatusProfile;
            }
        }
        return 'NotFound'; 
    }
}
