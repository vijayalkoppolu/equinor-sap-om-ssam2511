import ApplyFilterAndSave from '../../../Filter/ApplyFilterAndSave';

const SWITCH = 'CountDatePhysInvSwitch';
const START_DATE_FILTER = 'StartDateFilter';
const END_DATE_FILTER = 'EndDateFilter'; 

/**
 * Returns the filter values for the PI search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI search filters
 */
export default function PISearchFilterOnApply(context) {
    if (getCountDateSwitchState(context) && (getStartDate(context) > getEndDate(context))) {
        return context.executeAction({
            'Name': '/SAPAssetManager/Actions/Common/GenericEndDateWarningDialog.action',
            'Properties': {
                'Message': context.localizeText('from_greater_to'),
            },
        });
    }
    return ApplyFilterAndSave(context);
}

/**
 * Get the start date value
 * @param {IClientAPI} context 
 * @returns 
 */
function getStartDate(context) {
    return getFormCellContainer(context).getControl(START_DATE_FILTER).getValue();
}

/**
 * Get the end date value
 * @param {IClientAPI} context 
 * @returns 
 */
function getEndDate(context) {
    return getFormCellContainer(context).getControl(END_DATE_FILTER).getValue();
}

/**
 * Get the state of the count date switch
 * @returns {boolean} the value of the count date switch
 */
function getCountDateSwitchState(context) {
    return getFormCellContainer(context).getControl(SWITCH).getValue();
}

/**
 * Get the form cell container
 * @param {IClientAPI} context 
 * @returns 
 */
function getFormCellContainer(context) {
    return context.getPageProxy().getControl('FormCellContainer');
}
