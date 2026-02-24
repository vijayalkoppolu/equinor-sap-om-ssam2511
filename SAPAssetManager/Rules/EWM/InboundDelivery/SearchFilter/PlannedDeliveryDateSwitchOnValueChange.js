import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function PlannedDeliveryDateSwitchOnValueChange(context) {
    const pageName = CommonLibrary.getPageName(context);
    const startDateControl = 'PlannedDeliveryDateFrom';
    const endDateControl = 'PlannedDeliveryDateTo';
    const switchControl = 'PlannedDeliveryDateSwitch';

    const result = CommonLibrary.SetFilterDatePickerVisibility(
        context,
        context.evaluateTargetPath(`#Page:${pageName}/#ClientData`),
        pageName,
        switchControl,
        startDateControl,
        endDateControl,
    );

    RedrawFilterToolbar(context);
    return result;
}
