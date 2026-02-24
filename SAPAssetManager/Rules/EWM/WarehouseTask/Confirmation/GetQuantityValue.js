import CommonLibrary from '../../../Common/Library/CommonLibrary';
import { GetConfirmedAndTotalQuantity } from '../../Common/EWMLibrary';

export default function GetQuantityValue(context) {
    // modify local confirmation
    if (context.binding?.['@odata.type'] === '#sap_mobile.WarehouseTaskConfirmation') {
        return context.binding.ActualQuantity;
    }

    const binding = CommonLibrary.getStateVariable(context, 'WarehouseTask');
    return GetConfirmedAndTotalQuantity(context, binding).then(({ confirmedQuantity, totalQuantity }) => {
        const remainingQuantity = totalQuantity - confirmedQuantity;
        return remainingQuantity.toString();
    });
}
