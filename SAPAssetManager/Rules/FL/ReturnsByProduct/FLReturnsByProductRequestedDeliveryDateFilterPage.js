// Rule to toggle visibility of RequestedDeliveryDate date picker based on RequestedDeliveryDateSwitch
export default function FLReturnsByProductRequestedDeliveryDateFilterPage(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const isEnabled = pageProxy.getControl('FormCellContainer').getControl('RequestedDeliveryDateSwitch').getValue();
    pageProxy.getControl('FormCellContainer').getControl('RequestedDeliveryDate').setVisible(isEnabled);
}
