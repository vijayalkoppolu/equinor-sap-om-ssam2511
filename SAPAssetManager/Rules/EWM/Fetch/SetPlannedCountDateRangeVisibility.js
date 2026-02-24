/**
* Controls the visibility of the bounary values of a date range
* @param {IClientAPI} clientAPI
*/
export default function SetPlannedCountDateRangeVisibility(context) {
    const page = 'EWMFetchDocumentsPage';
    const DateRangeSwitch = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedCountDateRangeSwitch`);
    const startDate = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedCountStartDate`);
    const endDate = context.evaluateTargetPath(`#Page:${page}/#Control:PlannedCountEndDate`);

    const visibilityValue = DateRangeSwitch.getValue();
    startDate.setVisible(visibilityValue);
    endDate.setVisible(visibilityValue);

    startDate.redraw();
    endDate.redraw();
}
