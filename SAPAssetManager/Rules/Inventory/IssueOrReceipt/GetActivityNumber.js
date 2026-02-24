import { MovementTypes } from '../Common/Library/InventoryLibrary';

export default function GetActivityNumber(context) {
    return getActivityNumberFromItem(context.binding);
}

export function getActivityNumberFromItem(bindingObject) {
    if (bindingObject) {
        const type = bindingObject['@odata.type'].substring('#sap_mobile.'.length);
        if (type === 'MaterialDocItem' || type === 'PurchaseOrderItem') {
            return bindingObject.NetworkActivity;
        } else if (type === 'ReservationItem') {
            return bindingObject.MovementType === MovementTypes.t261 ? bindingObject.OrderOperationNo : bindingObject.NetworkActivity;
        }
    }
    return '';
}
