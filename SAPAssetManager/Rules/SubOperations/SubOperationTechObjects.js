/**
* Describe this function...
* @param {IClientAPI} context
*/
import ValidationLibrary from '../Common/Library/ValidationLibrary';

export default function SubOperationTechObjects(context) {
    let techObjects = [];
    if (ValidationLibrary.evalIsNotEmpty(context.binding.OperationEquipment)) {
        techObjects.push(context.binding.OperationEquipment);
    }
    if (ValidationLibrary.evalIsNotEmpty(context.binding.FunctionalLocationSubOperation)) {
        techObjects.push(context.binding.FunctionalLocationSubOperation.FuncLocId);
    }
    if (techObjects.length === 0) {
        // check Operation equip & floc
        if (ValidationLibrary.evalIsNotEmpty(context.binding.WorkOrderOperation) && ValidationLibrary.evalIsNotEmpty(context.binding.WorkOrderOperation.OperationEquipment)) {
            techObjects.push(context.binding.WorkOrderOperation.OperationEquipment);
        }
        if (ValidationLibrary.evalIsNotEmpty(context.binding.WorkOrderOperation) && ValidationLibrary.evalIsNotEmpty(context.binding.WorkOrderOperation.FunctionalLocationOperation)) {
            techObjects.push(context.binding.WorkOrderOperation.FunctionalLocationOperation.FuncLocId);
        }

        if (techObjects.length === 0) {
            // check WO equip & floc
            let WOHeader = context.binding.WorkOrderOperation.WOHeader;
            if (ValidationLibrary.evalIsNotEmpty(WOHeader) && ValidationLibrary.evalIsNotEmpty(WOHeader.HeaderEquipment)) {
                techObjects.push(WOHeader.HeaderEquipment);
            }
            if (ValidationLibrary.evalIsNotEmpty(WOHeader.FunctionalLocation) && ValidationLibrary.evalIsNotEmpty(WOHeader.FunctionalLocation.FuncLocId)) {
                techObjects.push(WOHeader.FunctionalLocation.FuncLocId);
            }
        }

    }
    return techObjects.join(', ');
}
