import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function HUDelItemsDispatchDateFilter(context) {
    const pageName = CommonLibrary.getPageName(context);
    const [startDateControl, endDateControl, dispatchDateSwitchControl] = ['HUDelItemsStartDateFilter', 'HUDelItemsEndDateFilter', 'HUDelItemsDispatchDateSwitch'];
    const result = CommonLibrary.SetFilterDatePickerVisibility(context, context.evaluateTargetPath(`#Page:${pageName}/#ClientData`), `${pageName}`, dispatchDateSwitchControl, startDateControl, endDateControl);
    RedrawFilterToolbar(context);
    return result;
}
