import CommonLibrary from '../../Common/Library/CommonLibrary';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import MobileStatusLibrary from '../../MobileStatus/MobileStatusLibrary';
import { reloadUserTimeEntriesForLocalStatus } from './ObjectCardButtonVisible';
import OperationMobileStatusLibrary from '../../Operations/MobileStatus/OperationMobileStatusLibrary';
import TechniciansExist from '../../WorkOrders/Operations/TechniciansExist';

/**
 * Common function to get object card button title. Takes in transaction type(s) and returns one or all corresponding title(s)
 * @param {*} context
 * @param {Array<string>} transitionTypes array of transition types that need to be found among options
 * @param {boolean} [findAll=false] indicates if function should return all titles that match passed transition types
 * @returns object card button title
 */
export default async function ObjectCardButtonTitle(context, transitionTypes = [], findAll = false) {
    let binding = context.binding;
    let objectType = CommonLibrary.isDefined(CommonLibrary.getMobileStatusEAMObjectType(context,binding)) ? CommonLibrary.getMobileStatusEAMObjectType(context,binding) : MobileStatusLibrary.getMobileStatusNavLink(context)?.OverallStatusCfg_Nav?.ObjectType;
    let currentStatusOverride = null;

    const operationCapacityRequirementType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperationCapacity.global').getValue();
    const operationType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();
    const workOrderType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrder.global').getValue();

    if (objectType === operationType) {
        //if splits exist and there is a split for the current user then we're changing the split status
        if (await TechniciansExist(context, binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {
            const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, binding);
            if (result.empty) {
                return Promise.resolve('');
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

    if (findAll) {
        return options.filter(item => transitionTypes.includes(item.TransitionType));
    }

    const action = options.find(item => transitionTypes.includes(item.TransitionType));

    return CommonLibrary.isDefined(action) ?
        action.Title :
        '';
}
