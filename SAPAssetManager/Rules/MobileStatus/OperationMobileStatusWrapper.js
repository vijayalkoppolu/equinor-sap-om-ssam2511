import TechniciansExist from '../WorkOrders/Operations/TechniciansExist';
import OperationMobileStatusLibrary from '../Operations/MobileStatus/OperationMobileStatusLibrary';
import MobileStatusLibrary from './MobileStatusLibrary';
import OperationMobileStatus from './OperationMobileStatus';

export default async function OperationMobileStatusWrapper(context, binding = context.binding) {
    if (await TechniciansExist(context, binding) && MobileStatusLibrary.isOperationStatusChangeable(context)) {
        const split = await OperationMobileStatusLibrary.findMySplitForOperation(context, binding);

        if (split) {
            binding = split;
        }
    }

    return OperationMobileStatus(context, binding);
}
