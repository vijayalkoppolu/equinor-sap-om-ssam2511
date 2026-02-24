// Rule to toggle visibility of RequestedDeliveryDate date picker based on RequestedDeliveryDateSwitch
export default function FLReturnsByProductRequestedDeliveryDateFilter(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const isEnabled = pageProxy.getControl('SectionedTable').getSection('FetchReturnsByProductSection').getControl('RequestedDeliveryDateSwitch').getValue();
    pageProxy.getControl('SectionedTable').getSection('FetchReturnsByProductSection').getControl('RequestedDeliveryDate').setVisible(isEnabled);
}
