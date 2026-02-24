import libVal from '../../../Common/Library/ValidationLibrary';
import libCom from '../../../Common/Library/CommonLibrary';
import {FldLogsWOProductStatus} from '../../Common/FLLibrary';
export default function ProductStatusUpdateFromResv(context) {
    if (context.binding['@odata.readLink'].includes('FldLogsWoResvItems')) {
        const binding = context.binding;
        const product = binding.Product;
        const order = binding.Order;
        const operation = binding.Operation;
        const plant = binding.Plant;
        const itemQuery = `$filter=Product eq '${product}' and Order eq '${order}' and Operation eq '${operation}' and Plant eq '${plant}'`;
        return context.read('/SAPAssetManager/Services/AssetManager.service', 'FldLogsWoProducts', [], itemQuery).then(function(result) {
            if (!libVal.evalIsEmpty(result)) {
                let item = result.getItem(0);
                let entryQty = Number(context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
                const entryQtyOld = Number(libCom.getStateVariable(context, 'EntryQtyOld'));
                if (entryQtyOld === 0) {// inital update
                    if (entryQty === item.WithdrawnQty) {
                        return FldLogsWOProductStatus.Returned; // If the entry quantity is equal to the withdrawn quantity, return 'R'.
                    }
                }
                let withdrawnQty = item.WithdrawnQty + (entryQtyOld - entryQty);
                return withdrawnQty === 0 ? FldLogsWOProductStatus.Returned : ''; // If withdrawn quantity is zero, return 'R' status, else return empty string.
            }
            return '';
        });
    }
}

