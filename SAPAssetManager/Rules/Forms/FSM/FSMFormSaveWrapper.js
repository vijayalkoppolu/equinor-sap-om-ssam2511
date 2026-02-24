import libCom from '../../Common/Library/CommonLibrary';
import FSMFormSave from './FSMFormSave';
import FSMFormSaveWindows from './FSMFormSaveWindows';
import isWindows from '../../Common/IsWindows';
import ApplicationSettings from '../../Common/Library/ApplicationSettings';
import SmartFormsConfirmationLibrary from '../SmartFormsConfirmationLibrary';
import WorkOrderCompletionLibrary from '../../WorkOrders/Complete/WorkOrderCompletionLibrary';
import IsCompleteAction from '../../WorkOrders/Complete/IsCompleteAction';
import FSMSmartFormsLibrary from './FSMSmartFormsLibrary';

export default function FSMFormSaveWrapper(context) {
    libCom.setStateVariable(context, 'FSMClosedFlag', false); //Set the closed flag for updating instance to backend
    libCom.setStateVariable(context, 'FSMToastMessage', context.localizeText('forms_draft_toast'));
    return Promise.resolve(isWindows(context) ? FSMFormSaveWindows(context) : FSMFormSave(context)).then(() => {
        FSMSmartFormsLibrary.resetSmartFormsFlags(context);
        ApplicationSettings.remove(context,'XMLTemplateParsed');

        const isCompletionFlow = IsCompleteAction(context);
        if (isCompletionFlow) {
            if (libCom.getStateVariable(context, 'FSMToastMessage')) { //Either display save or closed toast message
                return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                    return navBackToSmartFormsCompletionListScreen(context);
                });
            }
            return navBackToSmartFormsCompletionListScreen(context);
        }

        if (SmartFormsConfirmationLibrary.isConfirmationAction(context)) {
            if (libCom.getStateVariable(context, 'FSMToastMessage')) { //Either display save or closed toast message
                return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action').then(() => {
                    return SmartFormsConfirmationLibrary.reopenConfirmationSmartFormsPage(context);
                });
            }
            return SmartFormsConfirmationLibrary.reopenConfirmationSmartFormsPage(context);
        }

        return context.executeAction('/SAPAssetManager/Actions/Page/ClosePage.action').then(() => {
            if (libCom.getStateVariable(context, 'FSMToastMessage')) { //Either display save or closed toast message
                return context.executeAction('/SAPAssetManager/Actions/Forms/FSM/FSMInstanceUpdateToast.action');
            }
            return Promise.resolve();
        });
    });
}

function navBackToSmartFormsCompletionListScreen(context) {
    return WorkOrderCompletionLibrary.getInstance().openMainPage(context, false, {
        'Name': '/SAPAssetManager/Actions/WorkOrders/OpenCompleteWorkOrderPage.action',
        'Properties': {
            'ClearHistory': true,
            'Transition': {
                'Name': 'None',
            },
        },
    }).then(() => {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Forms/FSM/FSMFormsCompletionListNav.action',
            'Properties': {
                'Transition': {
                    'Name': 'None',
                },
            },
        });
    });
}
