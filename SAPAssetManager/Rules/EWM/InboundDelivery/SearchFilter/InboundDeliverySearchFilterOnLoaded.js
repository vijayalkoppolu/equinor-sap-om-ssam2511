import FilterLibrary from '../../../Filter/FilterLibrary';
import FilterOnLoaded from '../../../Filter/FilterOnLoaded';

export default async function InboundDeliverySearchFilterOnLoaded(context) {
    FilterOnLoaded(context);

    const filters = context.getPageProxy().getFilter().getFilters();
    if (!filters || filters.length === 0) {
        return;
    }

    const fcContainer = context.getControls().find(c => c.getType() === 'Control.Type.FormCellContainer');

    const dateTimeFieldsCfg = {
        PlannedDeliveryDate: {
            switchControlName: 'PlannedDeliveryDateSwitch',
            datePickerControlsNames: ['PlannedDeliveryDateFrom', 'PlannedDeliveryDateTo'],
        },
    };
    FilterLibrary.SetValueInDatePickersFromQueryOptions(context, dateTimeFieldsCfg, filters, fcContainer);

    const productFilterTerms = [];
    filters.forEach(({ type, filterItems }) => {
        if (type === context.filterTypeEnum.Filter) {
            filterItems.forEach(filter => {
                const match = filter.match(/WarehouseInboundDeliveryItem_Nav\/any\(i: i\/Product eq '([^']+)'\)/);
                if (match && match[1]) {
                    productFilterTerms.push(match[1]);
                }
            });
        }
    });

    if (productFilterTerms.length > 0) {
        const productControl = fcContainer.getControl('Product');
        productControl.setValue(productFilterTerms);
    }
}
