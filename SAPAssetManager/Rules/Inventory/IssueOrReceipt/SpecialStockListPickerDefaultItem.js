import libenv, { MovementTypes, SpecialStock } from '../Common/Library/InventoryLibrary';
import ODataLibrary from '../../OData/ODataLibrary';
/**
 * @param {IListPickerFormCellProxy} context
*/
export default function SpecialStockListPickerDefaultItem(context) {

    if (context.binding) {
        let isLocal = ODataLibrary.isLocal(context.binding);
        if (isLocal) {
            return context.binding.SpecialStockInd;
        }
        const selectedMovementType = getSelectedMovementType(context);
        return selectedMovementType === MovementTypes.t231 ? SpecialStock.OrdersOnHand : '';
    }
}

function getSelectedMovementType(context) {
    const fcContainer = context.getPageProxy().getControl('FormCellContainer');
    return fcContainer && fcContainer.getControl('MovementTypePicker') && libenv.GetListPickerSelection(fcContainer.getControl('MovementTypePicker'));
}

