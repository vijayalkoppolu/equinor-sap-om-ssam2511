import ODataDate from '../../Common/Date/ODataDate';

export default function EWMPhysicalInventoryItemDateDisplay(context) {
    const countdate = context.binding?.WarehousePhysicalInventory_Nav?.CountDate;
    return countdate ? EWMDisplayDate(context, countdate) : '-';
}

export function EWMDisplayDate(context, countdate) {
    const date = new ODataDate(countdate).toLocalDateString();
    return context.formatDatetime(date);
}
