export default function FSMCalendarType(context) {
    const pageProxy = context.getPageProxy();
    const segmentedValue = pageProxy?.getControls()?.[0]
        ?.getSection('PeriodFilterSection')
        ?.getControl('PeriodFilterSectionSegmented')
        ?.getValue()?.[0]?.ReturnValue;

    switch (segmentedValue) {
        case 'this_month_filter':
            return 'Month';
        case 'this_week_filter':
            return 'Week';
        default: // today or unselected
            return 'Expandable';
    }
}
