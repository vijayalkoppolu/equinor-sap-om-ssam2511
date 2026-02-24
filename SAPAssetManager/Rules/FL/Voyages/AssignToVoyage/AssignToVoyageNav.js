import CommonLibrary from '../../../Common/Library/CommonLibrary';
export default function AssignToVoyageNav(context) {
    const pageProxy = context.getPageProxy();
    const section = pageProxy.getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding);

    let itemType = '';
    if (selectedItems.length > 0) {
        const entityType = selectedItems[0]['@odata.type'];
        switch (entityType) {
            case '#sap_mobile.FldLogsPackCtnRdyPck':
                itemType = 'FldLogsPackCtnRdyPcks';
                break;
            case '#sap_mobile.FldLogsPackCtnPkdPkg':
                itemType = 'FldLogsPackCtnPkdPkgs';
                break;
            case '#sap_mobile.FldLogsPackCtnPkdCtn':
                itemType = 'FldLogsPackCtnPkdCtns';
                break;
            default:
                itemType = '';
        }
    }

    CommonLibrary.setStateVariable(context, 'AssignToVoyageItemType', itemType);
    CommonLibrary.setStateVariable(context, 'AssignToVoyageSelectedItems', selectedItems);

    return context.executeAction('/SAPAssetManager/Actions/FL/Voyages/AssignToVoyageNav.action');
}
