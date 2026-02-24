import libCom from '../../../Common/Library/CommonLibrary';
import libVal from '../../../Common/Library/ValidationLibrary';
export default function ProductWithdrawnQtyValue(context) {
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
                let screenQty = Number(context.getPageProxy().getControl('FormCellContainer').getControl('WithdrawnQuantity').getValue());
                let withdrawnQty = item.WithdrawnQty;
                const entryQtyOld = Number(libCom.getStateVariable(context, 'EntryQtyOld'));
                if (entryQtyOld  !== screenQty) {
                    if (entryQtyOld === 0) {
                        return withdrawnQty - screenQty;
                    }
                   withdrawnQty = item.WithdrawnQty + (entryQtyOld - screenQty);

                }
                return withdrawnQty;
            }
            return 0;
        });
    } else if (context.binding['@odata.readLink'].includes('FldLogsWoProducts')) {
        return 0;
    }
    return 0;
}


