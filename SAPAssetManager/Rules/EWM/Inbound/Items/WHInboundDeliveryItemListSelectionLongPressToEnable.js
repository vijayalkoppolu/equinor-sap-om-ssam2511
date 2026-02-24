import InboundDeliveryDetailsView from '../../InboundDelivery/InboundDeliveryDetailsView';

export default function WHInboundDeliveryItemListSelectionLongPressToEnable(context) {
    return InboundDeliveryDetailsView(context) ? 'Multiple' : 'None';
}
