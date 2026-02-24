import libCom from '../Common/Library/CommonLibrary';
import NotificationMobileStatusHelper from '../Notifications/MobileStatus/NotificationMobileStatusHelper';
import NotificationTaskMobileStatusHelper from '../Notifications/MobileStatus/NotificationTaskMobileStatusHelper';
import libMobile from './MobileStatusLibrary';
import ODataLibrary from '../OData/ODataLibrary';

/**
 * @typedef {import('./MobileStatusGenerator').StatusOverride} StatusOverride
 */

export default class NotificationMobileStatusGenerator {

    /**
     * 
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyNotificationHeader} binding 
     * @param {PMMobileStatus} currentStatus 
     * @param {string} objectType 
     */
    constructor(context, binding, currentStatus, objectType) {
        this._context = context;
        this._binding = binding;
        this._currentStatus = currentStatus;
        this._objectType = objectType;
        this._helperClass = this._getMobileStatusHelperClass(context, binding, currentStatus, objectType);

        const { STARTED, COMPLETED, SUCCESS } = libMobile.getMobileStatusValueConstants(context);
        
        this._STARTED = STARTED;
        this._COMPLETED = COMPLETED;
        this._SUCCESS = SUCCESS;
    }
    
    /**
     * Get helper class for current object type that will help run data type specific checks
     * @param {IPageProxy | ISelectableSectionProxy | IObjectCardCollectionSectionProxy} context 
     * @param {MyNotificationHeader} binding 
     * @param {...*} params
     * @returns {NotificationMobileStatusHelper}
     */
    _getMobileStatusHelperClass(context, binding, ...params) {
        switch (binding['@odata.type']) {
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/Notification.global').getValue():
                return new NotificationMobileStatusHelper(context, binding, ...params);
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/NotificationTask.global').getValue():
            case context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/NotificationItemTask.global').getValue():
                return new NotificationTaskMobileStatusHelper(context, binding, ...params);
            default:
                return new NotificationMobileStatusHelper(context, binding, ...params);
        }
    }

    /**
     * Get overrides for all possible statuses. Overrides contain additional info that we need to know to form correct set of UI items
     * (i.e. visibility, specific title, icon for context menu). If nothing needs to be overriden, default option will be used.
     * @returns {Object.<string, StatusOverride>}
     */
    getAllMobileStatusOptions() {
        if (this._areStatusOptionsVisible()) {
            return {
                [this._STARTED]: this._getStartedStatusOverrideProperties(),
                [this._COMPLETED]: this._getCompletedStatusOverrideProperties(),
                [this._SUCCESS]: this._getSuccessStatusOverrideProperties(),
                DEFAULT: this._getGenericStatusOverrideProperties(),
            };
        }

        return {
            DEFAULT: this._getGenericStatusOverrideProperties(false),
        };
    }

    /**
     * Get default override object
     * @returns {StatusOverride}
     */
    _getGenericStatusOverrideProperties(visible = true) {
        return {
            Visible: visible,
        };
    }
    
    /**
     * Get override for Started status
     * @returns {StatusOverride}
     */
    _getStartedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/start.png, /SAPAssetManager/Images/start.android.png)',
            ContextMenu_Style: 'ContextMenuGreen',
        };
    }
    
    /**
     * Get override for Completed status
     * @returns {StatusOverride}
     */
    _getCompletedStatusOverrideProperties() {
        return {
            ...this._getGenericStatusOverrideProperties(),
            ContextMenu_Icon: '$(PLT, /SAPAssetManager/Images/end.png, /SAPAssetManager/Images/end.android.png)',
        };
    }
    
    /**
     * Get override for Success status
     * @returns {StatusOverride}
     */
    _getSuccessStatusOverrideProperties() {
        const Visible = typeof this._helperClass.isSuccessStatusVisible === 'function' ?
        this._helperClass.isSuccessStatusVisible() : true;

        return {
            ...this._getGenericStatusOverrideProperties(),
            Visible,
        };
    }

    /**
     * Returns if status can be changed or not
     * @returns {boolean}
     */
    _areStatusOptionsVisible() {
        // We don't allow local mobile status changes if App Parameter MOBILESTATUS - EnableOnLocalBusinessObjects = N
        return !this._isLocalObjectAndEditingDisallowed() && this._helperClass.isStatusChangeable();
    }

    /**
     * Returns if editing local object is disallowed
     * @returns {boolean}
     */
    _isLocalObjectAndEditingDisallowed() {
        const isLocal = ODataLibrary.isLocal(this._binding);

        return isLocal && !libCom.isAppParameterEnabled(this._context, 'MOBILESTATUS', 'EnableOnLocalBusinessObjects');
    }

     /**
     * Gets status options for current object
     * @returns {string}
     */
    _getEAMOverallStatusProfile() {
        return this._helperClass.getEAMOverallStatusProfile();
    }
}
