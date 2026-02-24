import IsOperationLevelAssigmentType from '../../WorkOrders/Operations/IsOperationLevelAssigmentType';
import common from '../../Common/Library/CommonLibrary';
import IsSubOperationLevelAssigmentType from '../../WorkOrders/SubOperations/IsSubOperationLevelAssigmentType';
import IsFSMCSSectionVisible from '../../ServiceOrders/IsFSMCSSectionVisible';
import EnableWorkOrderCreate from '../../UserAuthorizations/WorkOrders/EnableWorkOrderCreate';

export default function ObjectCardOrderButtonVisible(context) {
    if ((IsFSMCSSectionVisible(context) && IsOperationLevelAssigmentType(context)) || !EnableWorkOrderCreate(context)) {
       return false;
    }

    const COMPLETE = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/CompleteParameterName.global').getValue());
    const TRANSFER = common.getAppParam(context, 'MOBILESTATUS', context.getGlobalDefinition('/SAPAssetManager/Globals/MobileStatus/ParameterNames/TransferParameterName.global').getValue());

    if (IsOperationLevelAssigmentType(context)) {
        let mobileStatus = context.binding.OperationMobileStatus_Nav.MobileStatus;
        return !(mobileStatus === COMPLETE || mobileStatus === TRANSFER);
    } else if (IsSubOperationLevelAssigmentType(context)) {
        return false;
    } else {
        return true;
    }
}
