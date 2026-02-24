import ODataLibrary from '../../../OData/ODataLibrary';

export default function WHInboundDeliveryItemIcon(context, binding = context.binding) {
    const icons = [];
    const itemchanges = binding ? ODataLibrary.hasAnyPendingChanges(binding) : false;
    const hasLocalserialchange = binding?.SerialNumber_Nav ? binding.SerialNumber_Nav.some(serial => ODataLibrary.hasAnyPendingChanges(serial)) : false;

    if (itemchanges || hasLocalserialchange) {
        icons.push('sap-icon://synchronize');
    }
    return icons;
}
