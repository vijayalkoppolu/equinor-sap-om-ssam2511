/**
 * refresh the sectioned table and filter bar
 * @param {IClientAPI} context 
 * @returns 
 */
export default function WarehouseOrderTaskListOnReturning(context) {
    const sectionedTableProxy = context.getControls()[0];
    // Setting the filters will redraw the FilterFeedbackBar.
    // Triggering section redraw with true param would force full redraw instead of row redraw.
    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('WarehouseTasksSectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    return sectionedTableProxy.redraw().then(() => {
        return Promise.resolve();
    });
}
