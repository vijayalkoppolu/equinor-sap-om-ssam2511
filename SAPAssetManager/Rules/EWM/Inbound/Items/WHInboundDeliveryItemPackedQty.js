import { formatQtyWithUOM } from './WHInboundDeliveryItemOpenPackableQty';

export default function WHInboundDeliveryItemPackedQty(context) {
    return formatQtyWithUOM(context.binding?.PackedQuantity, context.binding?.UnitofMeasure);
}
