export default function FLPackContainersFilterNav(clientAPI) {
    let selectedTab = clientAPI.getControl('TabsControl').getSelectedTabItemName();
    switch (selectedTab) {
        case 'ReadyToPackItems':
            return clientAPI.executeAction('/SAPAssetManager/Actions/FL/ReadyToPack/FLReadyToPackFilter.action');
           
        case 'PackedPackages':
            return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackedPackages/FLPackedPackagesFilter.action');
            
        case 'PackedContainers':
            return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainersFilter.action');

        default:
            return clientAPI.executeAction('/SAPAssetManager/Actions/FL/PackContainers/FLPackContainersFilter.action');
    }

}
