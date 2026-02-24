export default function WarehouseTaskCreateConfirmSwitchEditable(context) {
    const serialized = context.binding?.Serialized;
    return serialized !== 'X';
}
