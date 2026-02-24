import libCom from '../../Common/Library/CommonLibrary';
import CompleteWorkOrderMobileStatusAction from '../MobileStatus/CompleteWorkOrderMobileStatusAction';
import WorkOrderMobileStatusLibrary from '../MobileStatus/WorkOrderMobileStatusLibrary';
import PDFGenerateDuringCompletion from '../../PDF/PDFGenerateDuringCompletion';
import WorkOrderCompletionLibrary from './WorkOrderCompletionLibrary';
import libAutoSync from '../../ApplicationEvents/AutoSync/AutoSyncLibrary';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import ODataDate from '../../Common/Date/ODataDate';
import libClock from '../../ClockInClockOut/ClockInClockOutLibrary';
import generateGUID from '../../Common/guid';
import CompleteOperationMobileStatusAction from '../../Operations/MobileStatus/CompleteOperationMobileStatusAction';
import CompleteSubOperationMobileStatusAction from '../../SubOperations/MobileStatus/CompleteSubOperationMobileStatusAction';
import SubOperationMobileStatusLibrary from '../../SubOperations/MobileStatus/SubOperationMobileStatusLibrary';
import RedrawCompletePage from './RedrawCompletePage';
import SupervisorLibrary from '../../Supervisor/SupervisorLibrary';
import S4MobileStatusUpdateOverride from '../../ServiceOrders/Status/S4MobileStatusUpdateOverride';
import Logger from '../../Log/Logger';
import TimeSheetsIsEnabled from '../../TimeSheets/TimeSheetsIsEnabled';
import { IsBulkConfirmationQueueActive, RunNextBulkConfirmationAction } from '../Operations/BulkConfirmationQueue';
import libAnalytics from '../../Extensions/EventLoggers/Analytics/AnalyticsLibrary';
import libTelemetry from '../../Extensions/EventLoggers/Telemetry/TelemetryLibrary';
import S4ServiceLibrary from '../../ServiceOrders/S4ServiceLibrary';
import ConfirmationsIsEnabled from '../../Confirmations/ConfirmationsIsEnabled';
import { isOperationSupportConfirmation } from '../Operations/WorkOrderOperationLibrary';
import ToolbarRefresh from '../../Common/DetailsPageToolbar/ToolbarRefresh';

export default function FinalizeCompletePage(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    return Promise.all([SupervisorLibrary.checkReviewRequired(context, binding)]).then(async (checks) => {
        let isReviewRequired = checks[0];

        const isAutoComplete = WorkOrderCompletionLibrary.getInstance().getAutoCompleteFlag(context);
        const doValidation = !isAutoComplete;
        if (doValidation) {
            if (WorkOrderCompletionLibrary.validateSteps(context)) {
                WorkOrderCompletionLibrary.resetValidationMessages(context);
                RedrawCompletePage(context);
            } else {
                WorkOrderCompletionLibrary.setValidationMessages(context);
                RedrawCompletePage(context);
                return Promise.reject();
            }
        }

        let completeAction = Promise.resolve();
        let mobileStatus = '';

        if (WorkOrderCompletionLibrary.getInstance().isOperationFlow()) {

            let actionsPromise = beforeOperationComplete(context, isReviewRequired);
            completeAction = getOperationCompleteAction(context);
            mobileStatus = getOperationMobileStatus(context);
            let pageContext = context;
            return actionsPromise.then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return OperationMobileStatusLibrary.didSetOperationComplete(pageContext, mobileStatus).then(() => {
                            return (isAutoComplete ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                                let pdfAction = isReviewRequired ? Promise.resolve() : PDFGenerateDuringCompletion(context, binding);
                                return pdfAction.then(() => {
                                    WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                                    return completeAction.executeCheckWorkOrderCompleted(pageContext, completeAction).then(() => {
                                        if (isAutoComplete) {
                                            ToolbarRefresh(pageContext);
                                        }
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            }).then(() => {
                                //Add libAnalytics Check here
                                libAnalytics.operationCompleteSuccess();
                                libTelemetry.logUserEvent(context,
                                    context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(),
                                    libTelemetry.EVENT_TYPE_COMPLETE + '.op');
                            });
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                    })
                    .finally(() => {
                        libCom.removeStateVariable(context, 'isAnyOperationStarted');
                        return OperationMobileStatusLibrary.isAnyOperationStarted(context);
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isOperationSplitFlow()) {

            let actionsPromise = beforeOperationComplete(context, isReviewRequired);
            completeAction = getOperationCompleteAction(context);
            mobileStatus = getSplitMobileStatus(context);

            let pageContext = context;
            return actionsPromise.then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                .then(() => {
                    return OperationMobileStatusLibrary.didSetOperationComplete(pageContext, mobileStatus).then(() => {
                        return (isAutoComplete ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                            return completeOperationAfterSplitCompletion(context, binding.MyWorkOrderOperation_Nav).then(() => {
                                let pdfAction = isReviewRequired ? Promise.resolve() : PDFGenerateDuringCompletion(context, binding.MyWorkOrderOperation_Nav);
                                return pdfAction.then(() => {
                                    WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                                    WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);
                                    return completeAction.executeCheckWorkOrderCompleted(pageContext, completeAction).then(() => {
                                        if (isAutoComplete) {
                                            ToolbarRefresh(pageContext);
                                        }
                                        return libAutoSync.autoSyncOnStatusChange(context);
                                    });
                                });
                            });
                        }).then(() => {
                            //Add libAnalytics Check here
                            libAnalytics.operationCompleteSuccess();
                            libTelemetry.logUserEvent(context,
                                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(),
                                libTelemetry.EVENT_TYPE_COMPLETE + '.op');
                        });
                    });

                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/OperationMobileStatusFailureMessage.action');
                })
                .finally(() => {
                    libCom.removeStateVariable(context, 'isAnyOperationStarted');
                    return OperationMobileStatusLibrary.isAnyOperationStarted(context);
                });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isSubOperationFlow()) {
            let actionsPromise = beforeSubOperationComplete(context);
            completeAction = getSubOperationCompleteAction(context);
            mobileStatus = getSubOperationMobileStatus(context);
            let pageContext = context;
            return actionsPromise.then(() => {
                return completeAction.setMobileStatusComplete(pageContext, completeAction, binding)
                    .then(() => {
                        return (isAutoComplete ? Promise.resolve() : pageContext.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                            return SubOperationMobileStatusLibrary.didSetSubOperationCompleteWrapper(pageContext, mobileStatus).then(() => {
                                WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                                WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                                WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                                libCom.removeBindingObject(context);
                                libCom.removeStateVariable(context, 'contextMenuSwipePage');

                                return completeAction.executeCheckOperationCompleted(pageContext, completeAction).then(() => {
                                    if (isAutoComplete) {
                                        ToolbarRefresh(pageContext);
                                    }
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            });
                        }).then(() => {
                            //Add libAnalytics Check here
                            libAnalytics.suboperationCompleteSuccess();
                        });
                    })
                    .catch((error) => {
                        Logger.error('Completion Failed', error);
                        return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                    })
                    .finally(() => {
                        libCom.removeStateVariable(context, 'isAnySubOperationStarted');
                        return SubOperationMobileStatusLibrary.isAnySubOperationStarted(context);
                    });
            });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceOrderFlow()) {
            mobileStatus = getServiceOrderMobileStatus(context);
            completeAction = getCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/ServiceOrderMobileStatusSuccessMessage.action').then(() => {
                        return (isAutoComplete ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'isAnyOrderStarted');
                            S4ServiceLibrary.isAnythingStarted(context);
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            libAnalytics.serviceOrderCompleteSuccess();
                            libTelemetry.logUserEvent(context,
                                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceOrder.global').getValue(),
                                libTelemetry.EVENT_TYPE_COMPLETE);
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else if (WorkOrderCompletionLibrary.getInstance().isServiceItemFlow()) {
            mobileStatus = getServiceItemMobileStatus(context);
            completeAction = getCompleteAction(context, mobileStatus, binding);
            let pageContext = context;
            return pageContext.executeAction(completeAction)
                .then(() => {
                    return context.executeAction('/SAPAssetManager/Actions/ServiceOrders/ServiceItems/MobileStatus/ServiceItemMobileStatusSuccessMessage.action').then(() => {
                        return (isAutoComplete ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                            return PDFGenerateDuringCompletion(context, binding).then(() => {
                                return libAutoSync.autoSyncOnStatusChange(context);
                            });
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'IsAnyOperationStarted');
                            S4ServiceLibrary.isAnythingStarted(context, 'S4ServiceItems', 'IsAnyOperationStarted');
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            libAnalytics.serviceItemCompleteSuccess();
                            libTelemetry.logUserEvent(context,
                                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/CSServiceOrder.global').getValue(),
                                libTelemetry.EVENT_TYPE_COMPLETE + '.servItem');
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return pageContext.executeAction('/SAPAssetManager/Actions/WorkOrders/SubOperations/SubOperationMobileStatusFailureMessage.action');
                });
        } else {
            completeAction = getWOCompleteAction(context);
            mobileStatus = getWOMobileStatus(context);
            let pageContext = context;
            return completeAction.execute(pageContext)
                .then(() => {
                    return WorkOrderMobileStatusLibrary.didSetWorkOrderComplete(pageContext, mobileStatus).then(() => {
                        libCom.setStateVariable(context, 'expenses', []); // reset expenses
                        return (isAutoComplete ? Promise.resolve() : context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action')).then(() => {
                            if (isReviewRequired) {
                                if (IsBulkConfirmationQueueActive(context)) {
                                    return RunNextBulkConfirmationAction(context);
                                }

                                return libAutoSync.autoSyncOnStatusChange(context);
                            } else {
                                return PDFGenerateDuringCompletion(context, binding).then(() => {
                                    if (IsBulkConfirmationQueueActive(context)) {
                                        return Promise.resolve();
                                    }
                                    if (isAutoComplete) {
                                        ToolbarRefresh(pageContext);
                                    }
                                    return libAutoSync.autoSyncOnStatusChange(context);
                                });
                            }
                        }).finally(() => {
                            libCom.removeStateVariable(context, 'isAnyWorkOrderStarted');
                            WorkOrderMobileStatusLibrary.isAnyWorkOrderStarted(context);
                            WorkOrderCompletionLibrary.getInstance().setCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setAutoCompleteFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().setIsAutoCompleteOnApprovalFlag(pageContext, false);
                            WorkOrderCompletionLibrary.getInstance().deleteBinding(pageContext);

                            libCom.removeBindingObject(pageContext);
                            libCom.removeStateVariable(pageContext, 'contextMenuSwipePage');
                            //Add libAnalytics Check here
                            libAnalytics.orderCompleteSuccess();
                            libTelemetry.logUserEvent(context,
                                context.getGlobalDefinition('/SAPAssetManager/Globals/Features/PMWorkOrder.global').getValue(),
                                libTelemetry.EVENT_TYPE_COMPLETE);
                        });
                    });
                })
                .catch((error) => {
                    Logger.error('Completion Failed', error);
                    return context.executeAction('/SAPAssetManager/Actions/WorkOrders/MobileStatus/WorkOrderMobileStatusFailureMessage.action');
                });
        }
    });
}

/*
After completing the split, check if the user is allowed to complete the parent operation.
If allowed, show a warning message and proceed with completing the operation.
If there are open splits, show another warning message before creating a blank confirmation for the operation.
*/
async function completeOperationAfterSplitCompletion(context, operation) {
    if (await OperationMobileStatusLibrary.isUserAllowedToCompleteOperation(context, operation)) {
        const operationCompleteMessage = 'complete_operation_warning_message';
        const proceed = await libMobile.showWarningMessage(context, context.localizeText(operationCompleteMessage));
        if (proceed) {
            const openSplitsExist = await OperationMobileStatusLibrary.openSplitsForOperation(context, operation);
            if (openSplitsExist) {
                const message = 'operation_has_open_splits_warning_message';
                const proceedWithOpenSplits = await libMobile.showWarningMessage(context, context.localizeText(message));
                if (proceedWithOpenSplits) {
                    return OperationMobileStatusLibrary.createBlankConfirmation(context, 0, undefined, operation);
                }
            } else {
                return OperationMobileStatusLibrary.createBlankConfirmation(context, 0, undefined, operation);
            }

        }
    }

    return Promise.resolve();
}

function getWOMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OrderMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'WorkOrder');
    }

    return mobileStatus;
}

function getOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.OperationMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Operation');
    }

    return mobileStatus;
}

function getSplitMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.PMMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'Capacity');
    }

    return mobileStatus;
}

function getSubOperationMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.SubOpMobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'SubOperation');
    }

    return mobileStatus;
}

function getWOCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        WorkOrderId: binding.OrderId,
    };
    let action = new CompleteWorkOrderMobileStatusAction(actionArgs);

    context.getClientData().confirmationArgs = {
        doCheckWorkOrderComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

function getOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckOperationComplete: false,
    };
    context.getClientData().mobileStatusAction = action;

    return action;
}

async function beforeOperationComplete(context, isReviewRequired) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    const isConfirmationSupported = await isOperationSupportConfirmation(context, binding);
    const isNotFinalConfirmation = !libCom.getStateVariable(context, 'OperationFinalConfirmation');
    const isTimeStepWasNotSet = !WorkOrderCompletionLibrary.getStepValue(context, 'time');
    const linkProperties = libClock.getLinkProperties(context, binding['@odata.type']);

    if (isNotFinalConfirmation && isConfirmationSupported && !isReviewRequired) {
        if ((ConfirmationsIsEnabled(context) && isTimeStepWasNotSet) || TimeSheetsIsEnabled(context)) {
            actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
        }
    }

    libCom.removeStateVariable(context, 'OperationFinalConfirmation');

    if (libMobile.isOperationStatusChangeable(context)) { //Handle clock out create for operation
        const odataDate = new ODataDate();
        actions.push(context.executeAction({
            'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                'Properties': {
                    'RecordId': generateGUID(),
                    'UserGUID': libCom.getUserGuid(context),
                    'OperationNo': binding.OperationNo,
                    'OrderId': binding.OrderId,
                    'PreferenceGroup': libClock.isCICOEnabled(context) ? 'CLOCK_OUT' : 'END_TIME',
                    'PreferenceName': binding.OrderId,
                    'PreferenceValue': odataDate.toDBDateTimeString(context),
                    'UserId': libCom.getSapUserName(context),
                    'CapacityRequirement': binding.CapacityRequirement || '',
                    'CapacityRecordCounter': binding.CapacityRecordCounter || '',
                    'InternalCounter': binding.InternalCounter || '',
                },
                'CreateLinks': [{
                        'Property': linkProperties.linkProperty,
                        'Target':
                        {
                            'EntitySet': linkProperties.linkEntitySet,
                            'ReadLink': binding['@odata.readLink'],
                        },
                    }],
            },
        }));
    }

    return Promise.all(actions);
}

async function beforeSubOperationComplete(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actions = [];

    const isConfirmationSupported = await isOperationSupportConfirmation(context, binding);
    const isTimeStepWasNotSet = !WorkOrderCompletionLibrary.getStepValue(context, 'time');

    if (isConfirmationSupported && (TimeSheetsIsEnabled(context) || isTimeStepWasNotSet)) {
        actions.push(OperationMobileStatusLibrary.createBlankConfirmation(context));
    }

    if (libMobile.isSubOperationStatusChangeable(context)) {
        libClock.setClockOutSubOperationODataValues(context, binding);
        actions.push(context.executeAction(
            {
                'Name': '/SAPAssetManager/Actions/ClockInClockOut/WorkOrderClockInOut.action', 'Properties': {
                    'Properties': {
                        'RecordId': generateGUID(),
                        'UserGUID': libCom.getUserGuid(context),
                        'OperationNo': binding.OperationNo,
                        'SubOperationNo': binding.SubOperationNo,
                        'OrderId': binding.OrderId,
                        'PreferenceGroup': 'END_TIME',
                        'PreferenceName': binding.OrderId,
                        'PreferenceValue': new ODataDate().toDBDateTimeString(context),
                        'UserId': libCom.getSapUserName(context),
                    },
                    'CreateLinks': [{
                        'Property': 'WOSubOperation_Nav',
                        'Target':
                        {
                            'EntitySet': 'MyWorkOrderSubOperations',
                            'ReadLink': "MyWorkOrderSubOperations(OrderId='" + binding.OrderId + "',OperationNo='" + binding.OperationNo + "',SubOperationNo='" + binding.SubOperationNo + "')",
                        },
                    }],
                },
            },
        ));
    }

    return Promise.all(actions);
}

function getSubOperationCompleteAction(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let actionArgs = {
        subOperation: binding,
        SubOperationId: binding.SubOperationNo,
        OperationId: binding.OperationNo,
        WorkOrderId: binding.OrderId,
        isSubOperationStatusChangeable: libMobile.isSubOperationStatusChangeable(context),
        isOperationStatusChangeable: libMobile.isOperationStatusChangeable(context),
        isHeaderStatusChangeable: libMobile.isHeaderStatusChangeable(context),
        didCreateFinalConfirmation: libCom.getStateVariable(context, 'IsFinalConfirmation', libCom.getPageName(context)),
    };

    let action = new CompleteSubOperationMobileStatusAction(actionArgs);
    context.getClientData().confirmationArgs = {
        doCheckSubOperationComplete: false,
        doCheckOperationComplete: false,
    };

    return action;
}

function getServiceOrderMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ORDER');
    }

    return mobileStatus;
}

function getServiceItemMobileStatus(context) {
    let binding = WorkOrderCompletionLibrary.getInstance().getBinding(context);
    let mobileStatus = binding.MobileStatus_Nav;

    if (mobileStatus && !mobileStatus.ObjectType) {
        mobileStatus.ObjectType = libCom.getAppParam(context, 'OBJECTTYPE', 'S4_SRV_ITEM');
    }

    return mobileStatus;
}

function getCompleteAction(context, status, binding) {
    const completeMobileStatus = libCom.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    status.MobileStatus = completeMobileStatus;
    status.Status = `${status.ObjectType}: ${completeMobileStatus}`;
    return S4MobileStatusUpdateOverride(context, binding, status);
}
