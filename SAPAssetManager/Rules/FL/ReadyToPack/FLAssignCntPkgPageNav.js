import libCom from '../../Common/Library/CommonLibrary';
export default function FLAssignCntPKGPageNav(clientAPI) {
    const section = clientAPI.getPageProxy().getControls()[0].getSections()[0];
    const selectedItems = section.getSelectedItems().map(item => item.binding) || []; 
    libCom.setStateVariable(clientAPI, 'SelectedPackedPackages', selectedItems);
    libCom.setStateVariable(clientAPI, 'PackedPackages', false);

    clientAPI.getPageProxy().setActionBinding({tab: 'ReadyToPack'});

    return clientAPI.executeAction('/SAPAssetManager/Actions/FL/ReadyToPack/FLAssignCntPkgPageNav.action');
}
