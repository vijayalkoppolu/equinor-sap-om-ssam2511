/**
 * Refresh Inbound Delivery list when returning from filter page
 * @param {import("../../../.typings/IClientAPI").IClientAPI} context 
 */
export default function InboundDeliveryListOnReturning(context) {
    const sectionedTableProxy = context.getControls().find(c => c.getType() === 'Control.Type.SectionedTable');

    if (!sectionedTableProxy) {
        return;
    }

    const currentFilters = sectionedTableProxy.filters;
    sectionedTableProxy.filters = currentFilters;

    const section = sectionedTableProxy.getSection('SectionObjectTable');
    if (section) {
        section.redraw(true);
    }

    sectionedTableProxy.redraw();
}
