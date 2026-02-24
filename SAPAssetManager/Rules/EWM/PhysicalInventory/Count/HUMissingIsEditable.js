import { HURelatedPhysicalInventoryProcedures } from '../../Common/EWMLibrary';
import { PIActiveSwitchPresent } from './HUCompletedIsEditable';

export default function HUMissingIsEditable(context, binding = context.binding) {

    const huMissing = binding.NoHU === 'X';
    const procedureType = binding.PhysInvProcedure;
    const huEnabled = HURelatedPhysicalInventoryProcedures.includes(procedureType) && !!binding.HandlingUnit;
    if (binding.Serialized) {
        const selectedSerialNum = context.binding.WarehousePhysicalInventoryItemSerial_Nav.some(item => item.Selected);
        return huMissing || (huEnabled && selectedSerialNum === false && PIActiveSwitchPresent(context) === false);
    }
    return huMissing || (huEnabled && PIActiveSwitchPresent(context) === false);
}
