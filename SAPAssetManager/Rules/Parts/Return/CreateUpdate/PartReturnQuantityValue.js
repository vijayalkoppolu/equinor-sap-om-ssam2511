import PartLibrary from '../../PartLibrary';
import PartReturnIsQtyVisible from './PartReturnIsQtyVisible';

export default async function PartReturnQuantityValue(context) {
    if (PartReturnIsQtyVisible(context)) {
        const binding = context.getPageProxy().binding;
        const quantityIssued = await PartLibrary.getLocalQuantityIssued(context, binding);
        
        if (!quantityIssued) {
            return binding.QuantityUnE;
        }

        return Number(binding.WithdrawnQuantity + quantityIssued);
    }

    return '';
}
