import libCom from '../../Common/Library/CommonLibrary';
import libVal from '../../Common/Library/ValidationLibrary';
import MobileStatusGeneratorWrapper from '../../MobileStatus/MobileStatusGeneratorWrapper';
import CurrentMobileStatusOverride from '../../MobileStatus/CurrentMobileStatusOverride';
import OperationMobileStatusLibrary from '../MobileStatus/OperationMobileStatusLibrary';
import libMobile from '../../MobileStatus/MobileStatusLibrary';
import TechniciansExist from '../../WorkOrders/Operations/TechniciansExist';

export default async function OperationChangeStatusOptions(context, actionBinding, rereadStatus = false) {
    let binding = actionBinding || getBindingObject(context);
    let objectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ObjectTypes/WorkOrderOperation.global').getValue();

    //if splits exist and there is a split for the current user then we're changing the split status

    if (await TechniciansExist(context, binding) && libMobile.isOperationStatusChangeable(context)) {

        const result = await OperationMobileStatusLibrary.handleSplitStatusAndAuthorization(context, binding);
        if (result.empty) {
            return Promise.resolve([]);
        }
        binding = result.binding;
        objectType = result.objectType;
    }

    const currentStatusOverride = CurrentMobileStatusOverride(context, binding);

    // Return empty list for Operations without mobile status (WCM orders in some state)
    if (libVal.evalIsEmpty(binding?.OperationMobileStatus_Nav) && libVal.evalIsEmpty(binding.PMMobileStatus_Nav)) {
        return Promise.resolve([]);
    }

    const StatusGeneratorWrapper = new MobileStatusGeneratorWrapper(context, binding, objectType, currentStatusOverride);
    return StatusGeneratorWrapper.generateMobileStatusOptions(rereadStatus);
}

function getBindingObject(context) {
    let binding = context.binding;

    if (!libCom.isDefined(binding)) {
        const pageProxy = context.getPageProxy?.() || context;
        binding = pageProxy.getActionBinding();
    }

    return binding;
}
