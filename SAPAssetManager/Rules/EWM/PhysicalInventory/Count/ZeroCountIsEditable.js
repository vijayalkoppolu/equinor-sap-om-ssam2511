import { PIActiveSwitchPresent } from './HUCompletedIsEditable';

export default function ZeroCountIsEditable(context, binding = context.binding) {
    const zeroCount = binding.ZeroCount === 'X';
    if (binding.Serialized) {
        const selectedSerialNum = context.binding.WarehousePhysicalInventoryItemSerial_Nav.some(item => item.Selected);
        return zeroCount || (selectedSerialNum === false && PIActiveSwitchPresent(context) === false);
    }
    return PIActiveSwitchPresent(context) === false || zeroCount;
}
