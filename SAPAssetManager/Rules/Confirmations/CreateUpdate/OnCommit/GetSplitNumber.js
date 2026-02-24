import CommonLibrary from '../../../Common/Library/CommonLibrary';
import OperationMobileStatusLibrary from '../../../Operations/MobileStatus/OperationMobileStatusLibrary';

export default async function GetSplitNumber(context, binding = context.binding) {

    if (binding?.OperationObject && !binding.SubOperation) {
        const split = await OperationMobileStatusLibrary.findMySplitForOperation(context, binding.OperationObject);
        const completedStatus = CommonLibrary.getAppParam(context,'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());

        if (split && split.PMMobileStatus_Nav?.MobileStatus !== completedStatus) {
            return split.SplitNumber;
        }
    }
    return '';


}
