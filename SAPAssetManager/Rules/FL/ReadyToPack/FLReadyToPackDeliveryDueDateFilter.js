export default function FLReadyToPackDeliveryDueDateFilter(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const isEnabled = pageProxy.getControl('SectionedTable').getSection('FetchReadyToPackSection').getControl('DeliveryDueDateSwitch').getValue();
    pageProxy.getControl('SectionedTable').getSection('FetchReadyToPackSection').getControl('DeliveryDueDateStartDate').setVisible(isEnabled);
    pageProxy.getControl('SectionedTable').getSection('FetchReadyToPackSection').getControl('DeliveryDueDateEndDate').setVisible(isEnabled);
    return Promise.resolve();
}
