export default function FLReturnsByProductDispatchDateFilter(context) {
    const pageProxy = context.getPageProxy ? context.getPageProxy() : context;
    const isEnabled = pageProxy.getControl('FormCellContainer').getControl('DispatchPeriodSwitch').getValue();
    pageProxy.getControl('FormCellContainer').getControl('DispatchedStartDate').setVisible(isEnabled);
    pageProxy.getControl('FormCellContainer').getControl('DispatchedEndDate').setVisible(isEnabled);
    return Promise.resolve();
}
