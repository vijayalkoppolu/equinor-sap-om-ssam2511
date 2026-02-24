
import { InboundDeliveryStatusValue } from '../../Common/EWMLibrary';
import { formatQtyWithUOM } from './WHInboundDeliveryItemOpenPackableQty';

export default function WHInboundDeliveryItemPackedAndFullQty(context, binding = context.binding) {
    const statusPacked = binding?.PackingStatusValue === InboundDeliveryStatusValue.Completed;
    const qty = binding?.Quantity;
    const packedqty = binding?.PackedQuantity;
    const uom = binding?.UnitofMeasure;
    let text;

    if (qty == null || packedqty == null) { //quantities can be 0
        text = '-';
    } else if (!statusPacked && packedqty > 0 && packedqty < qty) {
        text = context.localizeText('quantity_of_x_x', [packedqty, qty]);
    } else {
        text = qty;
    }

    return formatQtyWithUOM(text, uom);
}

