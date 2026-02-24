export default function FLWorkOrdersListViewOnReturning(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    section.redraw();
}
