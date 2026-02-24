import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterOnLoaded from '../../../Filter/FilterOnLoaded';
/**
* This function sets date controls values based on existing filters
* @param {IClientAPI} clientAPI
*/
export default function PISearchFilterOnLoaded(context) {
    FilterOnLoaded(context);

    const filters = context.getPageProxy().getFilter().getFilters();
    if (filters) {
        const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');
        const dateTimeFieldsCfg = {
            CountDatePhysInv: {
                switchControlName: 'CountDatePhysInvSwitch',
                datePickerControlsNames: ['StartDateFilter', 'EndDateFilter'],
            },
        };
        FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcContainer);
    }
}
