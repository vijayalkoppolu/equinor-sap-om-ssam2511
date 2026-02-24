import { HURelatedPhysicalInventoryProcedures } from '../../Common/EWMLibrary';
import { PIActiveSwitchPresent } from './HUCompletedIsEditable';

export default function HUEmptyIsEditable(context, binding = context.binding) {

    const huEmpty = binding.HUEmpty === 'X';
    const procedureType = binding.PhysInvProcedure;
    const huEnabled = HURelatedPhysicalInventoryProcedures.includes(procedureType) && !!binding.HandlingUnit;
    if (binding.Serialized) {
        const selectedSerialNum = context.binding.WarehousePhysicalInventoryItemSerial_Nav.some(item => item.Selected);
        return huEmpty || (huEnabled && selectedSerialNum === false && PIActiveSwitchPresent(context) === false);
    }
    return huEmpty || (huEnabled && PIActiveSwitchPresent(context) === false);
}
