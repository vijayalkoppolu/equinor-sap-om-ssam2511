import OperationStatusUpdateSequenceClass from './OperationStatusUpdateSequenceClass';
import libCom from '../../Common/Library/CommonLibrary';
import libCICO from '../../ClockInClockOut/ClockInClockOutLibrary';
import { SEQUENCE_ITEMS_NAMES } from '../../WorkOrders/MobileStatus/WorkOrderStatusUpdateSequenceClass';
import libOperationMobile from './OperationMobileStatusLibrary';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import ActivityUpdate from '../../MobileStatus/ActivityUpdate';
import AutoSyncLibrary from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import MobileStatusUpdateOverride from '../../MobileStatus/MobileStatusUpdateOverride';
import MobileStatusUpdateResultsClass from '../../MobileStatus/MobileStatusUpdateResultsClass';
import Logger from '../../Log/Logger';
import IsConfirmationEnabledOperation from '../../Operations/IsConfirmationEnabledOperation';
import { getUpdateToStatusConfig } from '../../MobileStatus/RunMobileStatusUpdateSequence';
import NavOnCompleteOperationPage from '../../WorkOrders/Operations/NavOnCompleteOperationPage';


const MOBILE_STATUS_NAV_LINK = 'PMMobileStatus_Nav';
/*
This is the class that inherits the OperationStatusUpdateSequenceClass and implements the status update sequence for operations with splits.
*/
export default class OperationCapacityStatusUpdateSequenceClass extends OperationStatusUpdateSequenceClass {

    static async getStartStatusUpdateSequence(context, binding, status) {
        const STARTED = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/StartParameterName.global').getValue());
        const currentMobileStatus = binding[MOBILE_STATUS_NAV_LINK]?.MobileStatus;
        const isClockedIn = libCICO.isBusinessObjectClockedIn(context, binding) && libCICO.allowClockInOverride(context, currentMobileStatus);
        const updateSequence = this.getDefaultUpdateSequence(context, binding, status);
        const operationObjectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();

        const insertUpdateFlagIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.UPDATE_CICO) + 1;
        updateSequence.splice(insertUpdateFlagIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: this.updateIsAnythingStartedFlag.bind(null, context),
        });

        //If CICO enabled, current split is started, and nothing is clocked in, do not transition; clock in immediately
        if (currentMobileStatus === STARTED && (libCICO.isCICOEnabled(context) && !isClockedIn)) {
            // delete mobile status update and history create actions from sequence
            const mobileStatusUpdateIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE);
            updateSequence.splice(mobileStatusUpdateIdx, 2);
        }

        //When starting a split add actions for changing the operation status to started if it is not already started
        const operation = binding.MyWorkOrderOperation_Nav;
        if (operation.OperationMobileStatus_Nav.MobileStatus !== STARTED) {
            const mobileStatusUpdateIdx = updateSequence.findIndex(seqItem => seqItem.Name === SEQUENCE_ITEMS_NAMES.PHASE_MODEL_STATUS_CHANGE);
            if (mobileStatusUpdateIdx !== -1) {
                const operationMobileStatus = await getUpdateToStatusConfig(context, operation, {'MobileStatus': STARTED}, operationObjectType);

                updateSequence.splice(mobileStatusUpdateIdx, 0, {
                    Name: SEQUENCE_ITEMS_NAMES.OPERATION_PHASE_MODEL_STATUS_CHANGE,
                    Function: MobileStatusLibrary.phaseModelStatusChange.bind(null, context, status.MobileStatus, operation),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.OPERATION_STATUS_TO_STARTED,
                    Function: super.executeMobileStatusUpdateAction.bind(null, context, operationMobileStatus, operation),
                },
                );
            }
        }

        return updateSequence;
    }

     static getDefaultUpdateSequence(context, binding, status) {
            return [
                {
                    Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_CREATE,
                    Function: this.createActionResultsClassInstance,
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.LOCATION_UPDATE,
                    Rule: '/SAPAssetManager/Rules/MobileStatus/LocationUpdate.js',
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.PHASE_MODEL_STATUS_CHANGE,
                    Function: MobileStatusLibrary.phaseModelStatusChange.bind(null, context, status.MobileStatus, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                    Function: this.executeMobileStatusUpdateAction.bind(null, context, status, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.ACTIVITY_UPDATE,
                    Function: ActivityUpdate.bind(null, context, binding, status),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_HISTORY,
                    Rule: '/SAPAssetManager/Rules/MobileStatus/MobileStatusHistoryCreate.js',
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.UPDATE_CICO,
                    Function: libCICO.updateCICOOnStatusUpdate.bind(null, context, status.MobileStatus, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.RELOAD_TIME_ENTRIES,
                    Function: libCICO.reloadUserTimeEntries.bind(null, context, false, undefined, binding),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.TOOLBAR_REFRESH,
                    Rule: '/SAPAssetManager/Rules/Common/DetailsPageToolbar/ToolbarRefresh.js',
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.SUCCESS_MESSAGE,
                    Action: '/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusSuccessMessage.action',
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.AUTO_SYNC,
                    Function: AutoSyncLibrary.autoSyncOnStatusChange.bind(null, context),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
                    Function: this.clearStateVariables.bind(null, context),
                },
                {
                    Name: SEQUENCE_ITEMS_NAMES.ACTIONS_RESULTS_RESET,
                    Function: this.resetActionResults,
                },
            ];
        }

    static executeMobileStatusUpdateAction(context, status, binding) {
        const action = MobileStatusUpdateOverride(context, status, MOBILE_STATUS_NAV_LINK, '', binding);

        return context.executeAction(action).then(result => {
            let updateResult;

            try {
                updateResult = JSON.parse(result.data);
            } catch (exc) {
                Logger.error('OperationCapacityStatusUpdateSequenceClass', `Failed to parse mobile status update action result: ${exc}`);
                updateResult = {};
            }

            MobileStatusUpdateResultsClass.getInstance().saveActionResult(SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE, updateResult);
        });
    }

    static async getHoldStatusUpdateSequence(context, binding, status) {
        const defaultUpdateSequence = this.getDefaultUpdateSequence(context, binding, status);

        defaultUpdateSequence.splice(1, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CONFIRM_STATUS_CHANGE,
            Function: this.showChangeStatusConfirmationDialog.bind(null, context, 'hold_operation_warning_message'),
        });

        const insertIdx = 6 + 1;
        defaultUpdateSequence.splice(insertIdx, 0, {
            Name: SEQUENCE_ITEMS_NAMES.CLEAR_FLAGS,
            Function: this.updateIsAnythingStartedFlag.bind(null, context),
        });

        if (await IsConfirmationEnabledOperation(context, binding.MyWorkOrderOperation_Nav)) {
            defaultUpdateSequence.splice(insertIdx + 1, 0, {
                Name: SEQUENCE_ITEMS_NAMES.TIME_CAPTURE,
                Function: libOperationMobile.showTimeCaptureMessage.bind(null, context, status.MobileStatus, false, binding),
            });
        }

        return defaultUpdateSequence;
    }


    static getCompleteReviewStatusUpdateSequence(context, binding) {
        return [
            {
                Name: SEQUENCE_ITEMS_NAMES.MOBILE_STATUS_UPDATE,
                Function: NavOnCompleteOperationPage.bind(null, context, binding),
            },
        ];
    }

}
