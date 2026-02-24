import InboundDeliveryItemDetailsView from '../../Inbound/Items/InboundDeliveryItemDetailsView';

export default function IsSelectionModeEnabled(context) {
    return !InboundDeliveryItemDetailsView(context);
}
