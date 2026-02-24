export default function FLPackedPackagesListViewOnReturning(clientAPI) {
    const section = clientAPI.getPageProxy().getControl('SectionedTable');
    section.setSelectionMode('None');
    section.redraw();
}
