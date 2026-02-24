
export default function Filterable(context) {
    const sectionedTable = context.evaluateTargetPath('#Control:SectionedTable');
    let sorter = sectionedTable.getFilters()?.find(i => i.type === 2);
    if (sorter) {
        // remove 'desc' from applied filters so that corresponding option in sorter control can be preselected
        sorter.filterItems = sorter.filterItems.map(item => item.replaceAll(' desc', ''));
    }
    return sectionedTable;
}

