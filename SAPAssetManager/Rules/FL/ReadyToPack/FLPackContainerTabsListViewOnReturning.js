
export default function FLPackContainerTabsListViewOnReturning(clientAPI) {
    const pageConfig = {
        ReadyToPackItems: {
            pageName: 'ReadyToPackItemsListView',
        },
        PackedPackages: {
            pageName: 'PackedPackagesListViewPage',
        },
        PackedContainers: {
            pageName: 'PackedContainersListViewPage',
        },
    };
    var selectedTab = clientAPI.getControl('TabsControl').getSelectedTabItemName();

    const sectionedTable = clientAPI.evaluateTargetPathForAPI('#Page:' + pageConfig[selectedTab].pageName).getControl('SectionedTable');
    if (sectionedTable && sectionedTable.getSections().length > 0) {
        sectionedTable.getSections()[0].setSelectionMode('None');
    }
    sectionedTable.redraw();
}
