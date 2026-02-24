import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import libThis from './NotificationStatusUpdateSequenceClass';
import libCommon from '../../Common/Library/CommonLibrary';
import libAnalytics from '../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import CanNotificationMobileStatusComplete from './CanNotificationMobileStatusComplete';
import SDFIsFeatureEnabled from '../../Forms/SDF/SDFIsFeatureEnabled';
import FormInstanceCount from '../../Forms/SDF/FormInstanceCount';
import libNotifMobile from './NotificationMobileStatusLibrary';
import HideActionItems from '../../Common/HideActionItems';
import IsPhaseModelEnabled from '../../Common/IsPhaseModelEnabled';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

const NOTIFICATION_MOBILE_STATUS_NAV_LINK = 'NotifMobileStatus_Nav';
export const SEQUENCE_ITEMS_NAMES = {
    CONFIRM_STATUS_CHANGE: 'CONFIRM_STATUS_CHANGE',
    ACTIONS_RESULTS_CREATE: 'ACTIONS_RESULTS_CREATE',
    MOBILE_STATUS_UPDATE: 'MOBILE_STATUS_UPDATE',
    MOBILE_STATUS_HISTORY: 'MOBILE_STATUS_HISTORY',
    TOOLBAR_REFRESH: 'TOOLBAR_REFRESH',
    SUCCESS_MESSAGE: 'SUCCESS_MESSAGE',
    AUTO_SYNC: 'AUTO_SYNC',
    ACTIONS_RESULTS_RESET: 'ACTIONS_RESULTS_RESET',
    CLEAR_FLAGS: 'CLEAR_FLAGS',
    IS_STATUS_CHANGE_ALLOWED: 'IS_STATUS_CHANGE_ALLOWED',
    UPDATE_MALFUNCTION_END: 'UPDATE_MALFUNCTION_END',
    DIGITAL_SIGNATURE_DEVICE_REGISTRATION: 'DIGITAL_SIGNATURE_DEVICE_REGISTRATION',
    HIDE_ACTION_BAR_ITEMS: 'HIDE_ACTION_BAR_ITEMS',
    LOG_COMPLETE_EVENT: 'LOG_COMPLETE_EVENT',
};

export default class NotificationStatusUpdateSequenceClass {

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyNotificationHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static async getUpdateSequenceForStatus(context, binding, status) {
        const { COMPLETED } = libMobile.getMobileStatusValueConstants(context);

        switch (status.MobileStatus) {
            case COMPLETED:
                return libThis.getCompleteStatusUpdateSequence(context, binding, status);
            default:
                return libThis.getDefaultUpdateSequence(context, binding, status);
        }
    }

    /**
     * 
     * @param {IPageProxy} context 
     * @param {MyNotificationHeader} binding 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getDefaultUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                Function: libThis.createActionResultsClassInstance,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: '/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.setStateVariables.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_RESET,
                Function: libThis.resetActionResults,
            },
        ];
    }

    /**
     *
     * @returns {Array<UpdateSequenceItem>}
     */
    static getCompleteStatusUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                Function: libThis.createActionResultsClassInstance,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.IS_STATUS_CHANGE_ALLOWED,
                Function: libThis.checkIfNotificationCanBeCompleted.bind(null, context, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
                Function: libThis.showCompleteStatusConfirmationDialog.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.UPDATE_MALFUNCTION_END,
                Function: libNotifMobile.NotificationUpdateMalfunctionEnd.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.DIGITAL_SIGNATURE_DEVICE_REGISTRATION,
                Function: libNotifMobile.completeNotification.bind(null, context, () => Promise.resolve()),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: libThis.executeMobileStatusUpdateAction.bind(null, context, status, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.HIDE_ACTION_BAR_ITEMS,
                Function: libThis.hideActionBarItemsAfterCompletion.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Action: '/SAPAssetManager/Actions/Notifications/NotificationMobileStatusSuccessMessage.action',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                Function: libThis.setStateVariables.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.LOG_COMPLETE_EVENT,
                Function: libThis.logNotificationCompleteEvent,
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_RESET,
                Function: libThis.resetActionResults,
            },
        ];
    }

    static createActionResultsClassInstance() {
        MobileStatusUpdateResultsClass.getInstance();
    }
    
    static resetActionResults() {
        MobileStatusUpdateResultsClass.getInstance().resetAll();
    }
    
    static setStateVariables(context) {
        if (libCommon.getPageName(context).includes('Details')) {
            libCommon.setStateVariable(context, 'UpdateOnlineListOnReturn', true);
        }
    }
    
    static showChangeStatusConfirmationDialog(context, message) {
        return libMobile.showWarningMessage(context, context.localizeText(message)).then(confirmed => {
            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE, confirmed);
            MobileStatusUpdateResultsClass.getInstance().setSkipAll(!confirmed);
            return confirmed;
        });
    }

    static showCompleteStatusConfirmationDialog(context) {
        return libThis.showChangeStatusConfirmationDialog(context, 'notification_complete_warning').then(confirmed => {
            if (!confirmed) {
                libAnalytics.notificationCompleteCancel();
            }
        });
    }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = MobileStatusUpdateOverride(context, status, NOTIFICATION_MOBILE_STATUS_NAV_LINK, '', binding);

        return context.executeAction(action).then(result => {
            let updateResult;

            try {
                updateResult = JSON.parse(result.data);
            } catch (exc) {
                updateResult = {};
            }

            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE, updateResult);
        });
    }

    static async checkIfNotificationCanBeCompleted(context, binding) {
        const canComplete = IsPhaseModelEnabled(context) ? true : await CanNotificationMobileStatusComplete(context, binding);
        if (canComplete) {
            // continue update sequence execution
            return Promise.resolve();
        }

        let errorAction = '/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationTaskPendingError.action';
        if (SDFIsFeatureEnabled(context)) {
            const count = await FormInstanceCount(context, true);
            if (count > 0) {
                errorAction = '/SAPAssetManager/Actions/Notifications/MobileStatus/NotificationFormPendingError.action';
            }
        }

        MobileStatusUpdateResultsClass.getInstance().setSkipAll(true);
        return context.executeAction(errorAction);
    }

    static hideActionBarItemsAfterCompletion(context) {
        if (libCommon.getPageName(context).includes('Details')) {
            HideActionItems(context.getPageProxy(), 2);
        }
    }

    static logNotificationCompleteEvent() {
        libAnalytics.notificationCompleteSuccess();
    }
}
