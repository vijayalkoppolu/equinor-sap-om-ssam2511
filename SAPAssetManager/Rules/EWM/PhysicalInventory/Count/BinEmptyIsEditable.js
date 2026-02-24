import { PIActiveSwitchPresent } from './HUCompletedIsEditable';

export default function BinEmptyIsEditable(context, binding = context.binding) {
    const binEmpty = binding.EmptyBin === 'X';
    if (binding.Serialized) {
        const selectedSerialNum = context.binding.WarehousePhysicalInventoryItemSerial_Nav.some(item => item.Selected);
        return binEmpty || (selectedSerialNum === false && PIActiveSwitchPresent(context) === false);
    }
    return PIActiveSwitchPresent(context) === false || binEmpty;
}
