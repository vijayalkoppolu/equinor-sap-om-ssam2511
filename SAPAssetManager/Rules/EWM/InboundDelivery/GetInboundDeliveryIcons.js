import GetInboundDeliveryTrafficLight from './GetInboundDeliveryTrafficLight';
import ODataLibrary from '../../OData/ODataLibrary';

export default function GetInboundDeliveryIcons(context) {
    const icons = [
        GetInboundDeliveryTrafficLight(context),
    ];

    if (ODataLibrary.hasAnyPendingChanges(context.binding)) {
        icons.push('sap-icon://synchronize');
    }

    return icons;
}
