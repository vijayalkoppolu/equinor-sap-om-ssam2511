import CommonLibrary from '../../../Common/Library/CommonLibrary';
import RedrawFilterToolbar from '../../../Filter/RedrawFilterToolbar';

/**
 * Handle the visibility of the date filter controls based on the switch control value
 * @param {IClientAPI} context 
 * @returns 
 */
export default function PICountDatePhysInvSwitchOnValueChange(context) {
    const pageName = CommonLibrary.getPageName(context);
    const startDateControl = 'StartDateFilter';
    const endDateControl = 'EndDateFilter';
    const switchControl = 'CountDatePhysInvSwitch';
    const result = CommonLibrary.SetFilterDatePickerVisibility(context, context.evaluateTargetPath(`#Page:${pageName}/#ClientData`), `${pageName}`, switchControl, startDateControl, endDateControl);
    RedrawFilterToolbar(context);
    return result;
}
