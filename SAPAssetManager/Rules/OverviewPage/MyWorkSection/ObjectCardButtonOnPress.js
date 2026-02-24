import CommonLibrary from '../../Common/Library/CommonLibrary';
import { StatusTransitionTextsVar } from '../../Common/Library/GlobalStatusTransitionTexts';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import RunMobileStatusUpdateSequence, { getUpdateToStatusConfig } from '../../MobileStatus/RunMobileStatusUpdateSequence';
import { reloadUserTimeEntriesForLocalStatus } from './ObjectCardButtonVisible';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import TechniciansExist from '../../WorkOrders/Operations/TechniciansExist';

/**
 * Common function to get object card button OnPress action. Takes in transaction type(s) and executes corresponding on press action
 * @param {*} context
 * @param {*} binding
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {boolean} [findAll=false] indicates if function should find all items that match passed transition types
 * @param {*} [primaryType=null] primary transition type among passed transitionTypes
 * @returns either status update sequence or error message, if needed action is not found
 */
export default async function ObjectCardButtonOnPress(context, binding, transitionTypes, findAll = false, primaryType = null) {
    let objectType = CommonLibrary.isDefined(CommonLibrary.getMobileStatusEAMObjectType(context,binding)) ? CommonLibrary.getMobileStatusEAMObjectType(context,binding) : MobileStatusLibrary.getMobileStatusNavLink(context)?.OverallStatusCfg_Nav?.ObjectType;
    let currentStatusOverride = null;
    let action = null;

    const operationCapacityRequirementType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperationCapacity.global').getValue();
    const operationType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    const workOrderType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();

    if (objectType === operationType) {
        //if splits exist and there is a split for the current user then we're changing the split status
        if (await TechniciansExist(context, binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {
            const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, binding);
            if (result.empty) {
                return Promise.resolve();
            }
            binding = result.binding;
            objectType = result.objectType;
        }
    }

    if ([
        workOrderType,
        operationType,
        operationCapacityRequirementType,
    ].includes(objectType)) {
        await reloadUserTimeEntriesForLocalStatus(context, binding);
        currentStatusOverride = CurrentMobileStatusOverride(context, binding);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    const options = await StatusGeneratorWrapper.generateMobileStatusOptions();

    // In some cases like S4 orders/items we don't know needed transition type beforehand
    // and we have to determine what action will be executed based on items available
    if (findAll) {
        const actions = options.filter(item => transitionTypes.includes(item.TransitionType));
        action = actions.length > 1 ?
            actions.find(item => item.TransitionType === primaryType) :
            actions[0];
    } else {
        action = options.find(item => transitionTypes.includes(item.TransitionType));
    }

    if (action) {
        const mobileStatusForTextKey = StatusTransitionTextsVar.getStatusTransitionTexts(objectType)?.[action.Title];
        const updateToStatus = await getUpdateToStatusConfig(context, binding, mobileStatusForTextKey, objectType);
        context.getPageProxy().setActionBinding(binding);
        return RunMobileStatusUpdateSequence(context, binding, updateToStatus);
    }

    return context.executeAction('/SAPAssetManager/Actions/CreateUpdateDelete/UpdateEntityFailureMessage.action');
}
