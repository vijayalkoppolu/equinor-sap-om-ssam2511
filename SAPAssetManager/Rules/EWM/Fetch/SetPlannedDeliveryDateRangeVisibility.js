export default function SetPlannedDeliveryDateRangeVisibility(context) {
    const page = 'EWMFetchDocumentsPage';
    const DateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedDeliveryDateRangeSwitch`);
    const startDate = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedDeliveryStartDate`);
    const endDate = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedDeliveryEndDate`);

    const visibilityValue = DateRangeSwitch.getValue();
    startDate.setVisible(visibilityValue);
    endDate.setVisible(visibilityValue);

    startDate.redraw();
    endDate.redraw();
}

