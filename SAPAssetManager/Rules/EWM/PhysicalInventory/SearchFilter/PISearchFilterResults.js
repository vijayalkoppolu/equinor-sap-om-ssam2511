import libFilter from '../../../Inventory/Common/Library/InventoryFilterLibrary';
import libCommon from '../../../Common/Library/CommonLibrary';

const SWITCH = 'CountDatePhysInvSwitch';

/**
 * Returns the filter values for the PI search page
 * @param {import("../../../../.typings/IClientAPI").IClientAPI} context 
 * @returns the map of PI search filters
 */
export default function PISearchFilterResults(context) {
    const filterProps = [
        'PIDocumentNo',
        'WarehouseOrder',
        'PhysInvAreaDesc',
        'StorageType',
        'StorageBin',
    ];
    const filters = libFilter.GetSearchFilterResults(context, filterProps);
    addCountDateFilter(context, filters);
    return filters;
}

/**
 * Add Date pickers interval value for the count date to the filters
 * @param {IClientAPI} context 
 * @param {Array<>} filters 
 */
function addCountDateFilter(context, filters) {
    if (getCountDateSwitchState(context)) {
        const StartDateFilter = 'StartDateFilter';
        const EndDateFilter = 'EndDateFilter';
        const currentPage = 'WHPhysicalInventorySearchFilterPage';
        const dateFilter = libCommon.GetDateIntervalFilterValueDate(context, context.evaluateTargetPath(`#Page:${currentPage}/#ClientData`), currentPage, 'CountDatePhysInv', SWITCH, StartDateFilter, EndDateFilter);
        if (dateFilter) {
            filters.push(dateFilter);
        }
    }
}

/**
 * Get the state of the count date switch
 * @returns {boolean} the value of the count date switch
 */
function getCountDateSwitchState(context) {
    return context.getPageProxy().getControl('FormCellContainer').getControl(SWITCH).getValue();
}
