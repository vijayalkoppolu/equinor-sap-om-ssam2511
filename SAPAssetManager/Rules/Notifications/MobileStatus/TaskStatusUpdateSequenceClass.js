import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import libThis from './TaskStatusUpdateSequenceClass';
import libCommon from '../../Common/Library/CommonLibrary';
import HideActionItems from '../../Common/HideActionItems';
import { SEQUENCE_ITEMS_NAMES } from './NotificationStatusUpdateSequenceClass';
import { NotificationDetailsPageName } from '../Details/NotificationDetailsPageToOpen';
import CanNotificationMobileStatusComplete from './CanNotificationMobileStatusComplete';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';

/**
 * @typedef {import('../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass').UpdateSequenceItem} UpdateSequenceItem
 */

export default class TaskStatusUpdateSequenceClass {

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
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getDefaultUpdateSequence(context, binding, status) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: libThis.executeMobileStatusUpdateAction.bind(null, context, binding, status),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                Function: libThis.updateToolbar.bind(null, context, binding),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                Function: libThis.showSuccessMessage.bind(null, context, status.MobileStatus),
            },
            {
                Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                Function: libAutoSync.autoSyncOnStatusChange.bind(null, context),
            },
        ];
    }

    /**
     * 
     * @param {IPageProxy} context 
     * @param {Object} status 
     * @returns {Array<UpdateSequenceItem>}
     */
    static getCompleteStatusUpdateSequence(context, binding, status) {
        return [
            ...libThis.getDefaultUpdateSequence(context, binding, status),
            {
                Name: SEQUENCE_ITEMS_NAMES.HIDE_ACTION_BAR_ITEMS,
                Function: libThis.hideActionBarItemsAfterCompletion.bind(null, context),
            },
        ];
    }

    static executeMobileStatusUpdateAction(context, binding, status) {
        const objectType = libCommon.getGlobalDefinition(context, 'ObjectTypes/Task.global');
        const mobileStatusNavLink = libMobile.getMobileStatusNavLink(context, binding);

        return context.executeAction({
            Name: '/SAPAssetManager/Actions/Notifications/Task/TaskMobileStatusUpdate.action',
            Properties: {
                Target: {
                    ReadLink: mobileStatusNavLink['@odata.readLink'],
                },
                Properties: {
                    MobileStatus: status.MobileStatus,
                    EffectiveTimestamp: '/SAPAssetManager/Rules/DateTime/CurrentDateTime.js',
                },
                UpdateLinks: [
                    {
                        Property: 'OverallStatusCfg_Nav',
                        Target: {
                            'EntitySet': 'EAMOverallStatusConfigs',
                            'QueryOptions': `$filter=MobileStatus eq '${status.MobileStatus}' and ObjectType eq '${objectType}'`,
                        },
                    },
                ],
            },
        });
    }

    static showSuccessMessage(context, mobileStatus) {
        context.getPageProxy().getClientData().ChangeStatus = mobileStatus;
        return context.executeAction('/SAPAssetManager/Actions/Notifications/MobileStatus/TaskMobileStatusSuccessMessage.action');
    }


    static hideActionBarItemsAfterCompletion(context) {
        if ([
            'NotificationTaskDetailsPage',
            'NotificationItemTaskDetailsPage',
        ].includes(libCommon.getPageName(context))) {
            HideActionItems(context.getPageProxy(), 2);
        }
    }

    static updateToolbar(context, binding) {
        const isChangedFromCard = libCommon.getPageName(context) === NotificationDetailsPageName(context);

        if (isChangedFromCard) {
            return CanNotificationMobileStatusComplete(context, binding.Notification).then(allowed => {
                if (allowed) {
                    context.getPageProxy()?.getFioriToolbar()?.getItem('P_COMPLETED')?.setEnabled(allowed);
                }
            });
        }

        return ToolbarRefresh(context);
    }
}
