/**
* Describe this function...
* @param {IClientAPI} context
*/

import ValidationLibrary from '../Common/Library/ValidationLibrary';
export default function OperationTechObjects(context) {
    let techObjects = [];
    if (ValidationLibrary.evalIsNotEmpty(context.binding.OperationEquipment)) {
        techObjects.push(context.binding.OperationEquipment);
    }
    if (ValidationLibrary.evalIsNotEmpty(context.binding.FunctionalLocationOperation)) {
        techObjects.push(context.binding.FunctionalLocationOperation.FuncLocId);
    }
    if (techObjects.length === 0) {
        // check WO equip & floc
        if (ValidationLibrary.evalIsNotEmpty(context.binding.WOHeader) && ValidationLibrary.evalIsNotEmpty(context.binding.WOHeader.HeaderEquipment)) {
            techObjects.push(context.binding.WOHeader.HeaderEquipment);
        }
        if (ValidationLibrary.evalIsNotEmpty(context.binding.WOHeader.FunctionalLocation) && ValidationLibrary.evalIsNotEmpty(context.binding.WOHeader.FunctionalLocation.FuncLocId)) {
            techObjects.push(context.binding.WOHeader.FunctionalLocation.FuncLocId);
        }
    }
    return techObjects.join(', ');
}
