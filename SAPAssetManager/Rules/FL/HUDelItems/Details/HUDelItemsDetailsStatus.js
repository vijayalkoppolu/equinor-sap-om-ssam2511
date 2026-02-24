export default function HUDelItemsDetailsStatus(context) {
    return context.binding.FldLogsHUDelItemStatus_Nav
        ? context.binding.FldLogsHUDelItemStatus_Nav.FldContainerItemStatusDesc
        : context.binding.FldLogsContainerItemStatus_Nav
        ? context.binding.FldLogsContainerItemStatus_Nav.FldContainerItemStatusDesc
        : '';
}
