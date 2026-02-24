import { InboundDeliveryStatusValue } from '../Common/EWMLibrary';

export default function GetInboundDeliveryTrafficLight(context) {
    const status = context.binding.PutawayPlannedStatusValue;

    switch (status) {
        case InboundDeliveryStatusValue.NotStarted:
            return '/SAPAssetManager/Images/trafficlight_red.png';
        case InboundDeliveryStatusValue.Partial:
            return '/SAPAssetManager/Images/trafficlight_orange.png';
        case InboundDeliveryStatusValue.Completed:
            return '/SAPAssetManager/Images/trafficlight_green.png';
        default:
            return '/SAPAssetManager/Images/trafficlight_red.png';
    }
}
