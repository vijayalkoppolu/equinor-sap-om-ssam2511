import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

export default function ContainerDispatchDateFilter(context) {
    const pageName = CommonLibrary.getPageName(context);
    let startDateControl, endDateControl, dispatchDateSwitchControl;
    if (pageName === 'ContainersSearchFilterPage') {
        startDateControl = 'StartDateFilter';
        endDateControl = 'EndDateFilter';
        dispatchDateSwitchControl = 'DispatchDateSwitch';
    } else {
        startDateControl = 'ContainerStartDateFilter';
        endDateControl = 'ContainerEndDateFilter';
        dispatchDateSwitchControl = 'ContainerDispatchDateSwitch';
    }
    const result = CommonLibrary.SetFilterDatePickerVisibility(context, context.evaluateTargetPath(`#Page:${pageName}/#ClientData`), `${pageName}`, dispatchDateSwitchControl, startDateControl, endDateControl);
    RedrawFilterToolbar(context);
    return result;
}
