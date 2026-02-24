export default function FLReturnsByProductDispatchDateFilter(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const isEnabled = pageProxy.getControl('SectionedTable').getSection('FetchReturnsByProductSection').getControl('DispatchPeriodSwitch').getValue();
    pageProxy.getControl('SectionedTable').getSection('FetchReturnsByProductSection').getControl('DispatchedStartDate').setVisible(isEnabled);
    pageProxy.getControl('SectionedTable').getSection('FetchReturnsByProductSection').getControl('DispatchedEndDate').setVisible(isEnabled);
    return Promise.resolve();
}
