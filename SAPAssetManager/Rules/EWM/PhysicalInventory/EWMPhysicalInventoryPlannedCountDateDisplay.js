import { EWMDisplayDate } from './EWMPhysicalInventoryItemDateDisplay';

export default function EWMPhysicalInventoryItemDateDisplay(context) {
    const countdate = context.binding?.WarehousePhysicalInventory_Nav?.PlannedCountDate;
    return countdate ? EWMDisplayDate(context, countdate) : '-';
}
