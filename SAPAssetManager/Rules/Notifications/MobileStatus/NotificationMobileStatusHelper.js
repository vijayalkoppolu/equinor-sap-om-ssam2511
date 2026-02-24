import libMobile from '../../MobileStatus/MobileStatusLibrary';
import EnableNotificationEdit from '../../UserAuthorizations/Notifications/EnableNotificationEdit';
import { GetNotificationTypes } from '../../Common/CacheMobileStatusSeqs';

export default class NotificationMobileStatusHelper {

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
     * Returns if mobile status can be changed
     * @returns {boolean}
     */
    isStatusChangeable() {
        return EnableNotificationEdit(this._context, this._binding) && libMobile.isNotifHeaderStatusChangeable(this._context);
    }

     /**
     * Gets status options for current object
     * @returns {string}
     */
     getEAMOverallStatusProfile() {
        const notifType = this._binding?.NotificationType;
        if (notifType) {
            const notificationType = GetNotificationTypes(this._context).find(notifTypeRow => notifType === notifTypeRow.NotifType);
            if (notificationType) {
                return notificationType.EAMOverallStatusProfile;
            }
        }
        return 'NotFound'; 
    }
}
