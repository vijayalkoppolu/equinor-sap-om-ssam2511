import {ValueIfExists} from '../../../Common/Library/Formatter';
import TechniciansCount from '../TechniciansCount';

export default async function OperationNumberOfCapacities(context) {
    const binding = context.getBindingObject();
    const operationObjectType = context.getGlobalDefinition('/SAPAssetManager/Globals/ODataTypes/WorkOrderOperation.global').getValue();
    let numberOfCapacities = binding.NumberOfCapacities;

    if (binding?.['@odata.type'] === operationObjectType) { //Check if splits exist for this operation and return that count
        const count =  await TechniciansCount(context, binding);

        if (count > 0) {
            numberOfCapacities = count;
        }
    }

    return ValueIfExists(numberOfCapacities);
}
