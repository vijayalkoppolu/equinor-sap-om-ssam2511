/**
* Describe this function...
* @param {IClientAPI} context
*/
import ValidationLibrary from '../Common/Library/ValidationLibrary';
export default function WorkOrderTechObjects(context) {
    let techObjects = [];
    // check WO equip & floc
    if (ValidationLibrary.evalIsNotEmpty(context.binding.HeaderEquipment)) {
        techObjects.push(context.binding.HeaderEquipment);
    }
    if (ValidationLibrary.evalIsNotEmpty(context.binding.FunctionalLocation) && ValidationLibrary.evalIsNotEmpty(context.binding.FunctionalLocation.FuncLocId)) {
        techObjects.push(context.binding.FunctionalLocation.FuncLocId);
    }
    
    return techObjects.join(', ');
}
