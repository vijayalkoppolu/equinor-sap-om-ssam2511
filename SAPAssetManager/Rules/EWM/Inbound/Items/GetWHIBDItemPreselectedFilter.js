import WHGetInboundDeliveryItemUnpackedCaption from './WHGetInboundDeliveryItemUnpackedCaption';
import { INBOUND_DELIVERY_ITEM_UNPACKED_FILTER } from './WHInboundDeliveryItemListQuery';

export default function GetWHIBDItemPreSelectedFilter(context) {
    return [context.createFilterCriteria(context.filterTypeEnum.Filter, 'UnpackedIBD', [WHGetInboundDeliveryItemUnpackedCaption(context)], [INBOUND_DELIVERY_ITEM_UNPACKED_FILTER], true)];
}
